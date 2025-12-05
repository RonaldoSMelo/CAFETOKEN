const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("☕ CafeToken Contract", function () {
    let cafeToken;
    let owner;
    let producer;
    let buyer;
    let buyer2;

    const MINT_FEE = ethers.parseEther("0.01");
    const MARKETPLACE_FEE = 300; // 3%

    // Sample coffee lot data
    const sampleLot = {
        tokenURI: "ipfs://QmTest123",
        lotCode: "BR-MG-2024-001",
        weightKg: 300,
        scaScore: 8500, // 85.00 points
        harvestTimestamp: Math.floor(Date.now() / 1000),
        qualityReportHash: "QmQualityReport123"
    };

    beforeEach(async function () {
        [owner, producer, buyer, buyer2] = await ethers.getSigners();

        const CafeToken = await ethers.getContractFactory("CafeToken");
        cafeToken = await CafeToken.deploy();
        await cafeToken.waitForDeployment();
    });

    describe("📋 Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            expect(await cafeToken.name()).to.equal("CafeToken");
            expect(await cafeToken.symbol()).to.equal("CAFE");
        });

        it("Should set the correct owner", async function () {
            expect(await cafeToken.owner()).to.equal(owner.address);
        });

        it("Should set the correct mint fee", async function () {
            expect(await cafeToken.mintFee()).to.equal(MINT_FEE);
        });

        it("Should set the correct marketplace fee", async function () {
            expect(await cafeToken.marketplaceFee()).to.equal(MARKETPLACE_FEE);
        });

        it("Should start with token counter at 1", async function () {
            expect(await cafeToken.getTotalMinted()).to.equal(0);
        });
    });

    describe("🌱 Minting", function () {
        it("Should mint a coffee NFT successfully", async function () {
            const tx = await cafeToken.connect(producer).mintCoffeeLot(
                sampleLot.tokenURI,
                sampleLot.lotCode,
                sampleLot.weightKg,
                sampleLot.scaScore,
                sampleLot.harvestTimestamp,
                sampleLot.qualityReportHash,
                { value: MINT_FEE }
            );

            await expect(tx)
                .to.emit(cafeToken, "CoffeeMinted")
                .withArgs(1, sampleLot.lotCode, producer.address, sampleLot.weightKg, sampleLot.scaScore, sampleLot.tokenURI);

            expect(await cafeToken.ownerOf(1)).to.equal(producer.address);
            expect(await cafeToken.getTotalMinted()).to.equal(1);
        });

        it("Should store coffee lot data correctly", async function () {
            await cafeToken.connect(producer).mintCoffeeLot(
                sampleLot.tokenURI,
                sampleLot.lotCode,
                sampleLot.weightKg,
                sampleLot.scaScore,
                sampleLot.harvestTimestamp,
                sampleLot.qualityReportHash,
                { value: MINT_FEE }
            );

            const lot = await cafeToken.getCoffeeLot(1);
            expect(lot.lotCode).to.equal(sampleLot.lotCode);
            expect(lot.producer).to.equal(producer.address);
            expect(lot.weightKg).to.equal(sampleLot.weightKg);
            expect(lot.scaScore).to.equal(sampleLot.scaScore);
            expect(lot.redeemed).to.equal(false);
        });

        it("Should fail if mint fee is insufficient", async function () {
            await expect(
                cafeToken.connect(producer).mintCoffeeLot(
                    sampleLot.tokenURI,
                    sampleLot.lotCode,
                    sampleLot.weightKg,
                    sampleLot.scaScore,
                    sampleLot.harvestTimestamp,
                    sampleLot.qualityReportHash,
                    { value: ethers.parseEther("0.005") }
                )
            ).to.be.revertedWith("Insufficient mint fee");
        });

        it("Should fail if lot code is empty", async function () {
            await expect(
                cafeToken.connect(producer).mintCoffeeLot(
                    sampleLot.tokenURI,
                    "",
                    sampleLot.weightKg,
                    sampleLot.scaScore,
                    sampleLot.harvestTimestamp,
                    sampleLot.qualityReportHash,
                    { value: MINT_FEE }
                )
            ).to.be.revertedWith("Lot code required");
        });

        it("Should fail if lot code already exists", async function () {
            await cafeToken.connect(producer).mintCoffeeLot(
                sampleLot.tokenURI,
                sampleLot.lotCode,
                sampleLot.weightKg,
                sampleLot.scaScore,
                sampleLot.harvestTimestamp,
                sampleLot.qualityReportHash,
                { value: MINT_FEE }
            );

            await expect(
                cafeToken.connect(buyer).mintCoffeeLot(
                    "ipfs://QmTest456",
                    sampleLot.lotCode, // Same lot code
                    400,
                    8600,
                    sampleLot.harvestTimestamp,
                    "QmQualityReport456",
                    { value: MINT_FEE }
                )
            ).to.be.revertedWith("Lot code already exists");
        });

        it("Should fail if SCA score is invalid", async function () {
            await expect(
                cafeToken.connect(producer).mintCoffeeLot(
                    sampleLot.tokenURI,
                    sampleLot.lotCode,
                    sampleLot.weightKg,
                    7500, // Below 80.00
                    sampleLot.harvestTimestamp,
                    sampleLot.qualityReportHash,
                    { value: MINT_FEE }
                )
            ).to.be.revertedWith("Invalid SCA score");
        });

        it("Should refund excess payment", async function () {
            const excessPayment = ethers.parseEther("0.05");
            const initialBalance = await ethers.provider.getBalance(producer.address);

            const tx = await cafeToken.connect(producer).mintCoffeeLot(
                sampleLot.tokenURI,
                sampleLot.lotCode,
                sampleLot.weightKg,
                sampleLot.scaScore,
                sampleLot.harvestTimestamp,
                sampleLot.qualityReportHash,
                { value: excessPayment }
            );

            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;
            const finalBalance = await ethers.provider.getBalance(producer.address);

            // Should only charge mint fee + gas
            const expectedBalance = initialBalance - MINT_FEE - gasUsed;
            expect(finalBalance).to.be.closeTo(expectedBalance, ethers.parseEther("0.0001"));
        });
    });

    describe("🏪 Marketplace - Listing", function () {
        beforeEach(async function () {
            await cafeToken.connect(producer).mintCoffeeLot(
                sampleLot.tokenURI,
                sampleLot.lotCode,
                sampleLot.weightKg,
                sampleLot.scaScore,
                sampleLot.harvestTimestamp,
                sampleLot.qualityReportHash,
                { value: MINT_FEE }
            );
        });

        it("Should list NFT for sale", async function () {
            const price = ethers.parseEther("1.0");

            await expect(cafeToken.connect(producer).listForSale(1, price))
                .to.emit(cafeToken, "CoffeeListed")
                .withArgs(1, producer.address, price);

            const listing = await cafeToken.getListing(1);
            expect(listing.seller).to.equal(producer.address);
            expect(listing.price).to.equal(price);
            expect(listing.active).to.equal(true);
        });

        it("Should fail if not token owner", async function () {
            await expect(
                cafeToken.connect(buyer).listForSale(1, ethers.parseEther("1.0"))
            ).to.be.revertedWith("Not token owner");
        });

        it("Should fail if price is zero", async function () {
            await expect(
                cafeToken.connect(producer).listForSale(1, 0)
            ).to.be.revertedWith("Price must be positive");
        });

        it("Should fail if already listed", async function () {
            await cafeToken.connect(producer).listForSale(1, ethers.parseEther("1.0"));

            await expect(
                cafeToken.connect(producer).listForSale(1, ethers.parseEther("2.0"))
            ).to.be.revertedWith("Already listed");
        });
    });

    describe("🏪 Marketplace - Buying", function () {
        const listingPrice = ethers.parseEther("1.0");

        beforeEach(async function () {
            await cafeToken.connect(producer).mintCoffeeLot(
                sampleLot.tokenURI,
                sampleLot.lotCode,
                sampleLot.weightKg,
                sampleLot.scaScore,
                sampleLot.harvestTimestamp,
                sampleLot.qualityReportHash,
                { value: MINT_FEE }
            );
            await cafeToken.connect(producer).listForSale(1, listingPrice);
        });

        it("Should buy NFT successfully", async function () {
            await expect(cafeToken.connect(buyer).buyNFT(1, { value: listingPrice }))
                .to.emit(cafeToken, "CoffeeSold")
                .withArgs(1, producer.address, buyer.address, listingPrice);

            expect(await cafeToken.ownerOf(1)).to.equal(buyer.address);

            const listing = await cafeToken.getListing(1);
            expect(listing.active).to.equal(false);
        });

        it("Should transfer correct amounts with marketplace fee", async function () {
            const initialProducerBalance = await ethers.provider.getBalance(producer.address);
            const initialContractBalance = await ethers.provider.getBalance(await cafeToken.getAddress());

            await cafeToken.connect(buyer).buyNFT(1, { value: listingPrice });

            const fee = (listingPrice * BigInt(MARKETPLACE_FEE)) / BigInt(10000);
            const sellerAmount = listingPrice - fee;

            const finalProducerBalance = await ethers.provider.getBalance(producer.address);
            const finalContractBalance = await ethers.provider.getBalance(await cafeToken.getAddress());

            expect(finalProducerBalance).to.equal(initialProducerBalance + sellerAmount);
            expect(finalContractBalance).to.equal(initialContractBalance + fee);
        });

        it("Should fail if not listed", async function () {
            await cafeToken.connect(producer).cancelListing(1);

            await expect(
                cafeToken.connect(buyer).buyNFT(1, { value: listingPrice })
            ).to.be.revertedWith("Not for sale");
        });

        it("Should fail if payment is insufficient", async function () {
            await expect(
                cafeToken.connect(buyer).buyNFT(1, { value: ethers.parseEther("0.5") })
            ).to.be.revertedWith("Insufficient payment");
        });

        it("Should fail if buyer is seller", async function () {
            await expect(
                cafeToken.connect(producer).buyNFT(1, { value: listingPrice })
            ).to.be.revertedWith("Cannot buy own NFT");
        });
    });

    describe("🏪 Marketplace - Cancel & Update", function () {
        beforeEach(async function () {
            await cafeToken.connect(producer).mintCoffeeLot(
                sampleLot.tokenURI,
                sampleLot.lotCode,
                sampleLot.weightKg,
                sampleLot.scaScore,
                sampleLot.harvestTimestamp,
                sampleLot.qualityReportHash,
                { value: MINT_FEE }
            );
            await cafeToken.connect(producer).listForSale(1, ethers.parseEther("1.0"));
        });

        it("Should cancel listing", async function () {
            await expect(cafeToken.connect(producer).cancelListing(1))
                .to.emit(cafeToken, "ListingCancelled")
                .withArgs(1, producer.address);

            const listing = await cafeToken.getListing(1);
            expect(listing.active).to.equal(false);
        });

        it("Should update listing price", async function () {
            const newPrice = ethers.parseEther("2.0");

            await expect(cafeToken.connect(producer).updateListingPrice(1, newPrice))
                .to.emit(cafeToken, "CoffeeListed")
                .withArgs(1, producer.address, newPrice);

            const listing = await cafeToken.getListing(1);
            expect(listing.price).to.equal(newPrice);
        });
    });

    describe("♻️ Redemption", function () {
        beforeEach(async function () {
            await cafeToken.connect(producer).mintCoffeeLot(
                sampleLot.tokenURI,
                sampleLot.lotCode,
                sampleLot.weightKg,
                sampleLot.scaScore,
                sampleLot.harvestTimestamp,
                sampleLot.qualityReportHash,
                { value: MINT_FEE }
            );
        });

        it("Should redeem coffee successfully", async function () {
            await expect(cafeToken.connect(producer).redeemCoffee(1))
                .to.emit(cafeToken, "CoffeeRedeemed")
                .withArgs(1, producer.address, sampleLot.lotCode);

            const lot = await cafeToken.getCoffeeLot(1);
            expect(lot.redeemed).to.equal(true);
        });

        it("Should cancel active listing when redeeming", async function () {
            await cafeToken.connect(producer).listForSale(1, ethers.parseEther("1.0"));
            await cafeToken.connect(producer).redeemCoffee(1);

            const listing = await cafeToken.getListing(1);
            expect(listing.active).to.equal(false);
        });

        it("Should fail if already redeemed", async function () {
            await cafeToken.connect(producer).redeemCoffee(1);

            await expect(
                cafeToken.connect(producer).redeemCoffee(1)
            ).to.be.revertedWith("Coffee already redeemed");
        });

        it("Should fail to list redeemed coffee", async function () {
            await cafeToken.connect(producer).redeemCoffee(1);

            await expect(
                cafeToken.connect(producer).listForSale(1, ethers.parseEther("1.0"))
            ).to.be.revertedWith("Coffee already redeemed");
        });
    });

    describe("👑 Admin Functions", function () {
        it("Should update mint fee", async function () {
            const newFee = ethers.parseEther("0.02");

            await expect(cafeToken.connect(owner).setMintFee(newFee))
                .to.emit(cafeToken, "MintFeeUpdated")
                .withArgs(MINT_FEE, newFee);

            expect(await cafeToken.mintFee()).to.equal(newFee);
        });

        it("Should update marketplace fee", async function () {
            const newFee = 500; // 5%

            await expect(cafeToken.connect(owner).setMarketplaceFee(newFee))
                .to.emit(cafeToken, "MarketplaceFeeUpdated")
                .withArgs(MARKETPLACE_FEE, newFee);

            expect(await cafeToken.marketplaceFee()).to.equal(newFee);
        });

        it("Should fail to set marketplace fee above 10%", async function () {
            await expect(
                cafeToken.connect(owner).setMarketplaceFee(1500)
            ).to.be.revertedWith("Fee too high");
        });

        it("Should verify producer", async function () {
            await expect(cafeToken.connect(owner).setProducerVerification(producer.address, true))
                .to.emit(cafeToken, "ProducerVerified")
                .withArgs(producer.address, true);

            expect(await cafeToken.verifiedProducers(producer.address)).to.equal(true);
        });

        it("Should withdraw contract balance", async function () {
            // Mint some NFTs to accumulate fees
            await cafeToken.connect(producer).mintCoffeeLot(
                sampleLot.tokenURI,
                sampleLot.lotCode,
                sampleLot.weightKg,
                sampleLot.scaScore,
                sampleLot.harvestTimestamp,
                sampleLot.qualityReportHash,
                { value: MINT_FEE }
            );

            const contractBalance = await ethers.provider.getBalance(await cafeToken.getAddress());
            const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

            const tx = await cafeToken.connect(owner).withdraw();
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;

            const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance + contractBalance - gasUsed);
        });

        it("Should fail admin functions if not owner", async function () {
            await expect(
                cafeToken.connect(buyer).setMintFee(ethers.parseEther("0.02"))
            ).to.be.reverted;

            await expect(
                cafeToken.connect(buyer).setMarketplaceFee(500)
            ).to.be.reverted;

            await expect(
                cafeToken.connect(buyer).withdraw()
            ).to.be.reverted;
        });
    });

    describe("📊 View Functions", function () {
        beforeEach(async function () {
            // Mint 3 NFTs
            for (let i = 0; i < 3; i++) {
                await cafeToken.connect(producer).mintCoffeeLot(
                    `ipfs://QmTest${i}`,
                    `BR-MG-2024-00${i}`,
                    300 + i * 50,
                    8500 + i * 100,
                    sampleLot.harvestTimestamp,
                    `QmQualityReport${i}`,
                    { value: MINT_FEE }
                );
            }
        });

        it("Should get tokens by owner", async function () {
            const tokens = await cafeToken.getTokensByOwner(producer.address);
            expect(tokens.length).to.equal(3);
            expect(tokens[0]).to.equal(1);
            expect(tokens[1]).to.equal(2);
            expect(tokens[2]).to.equal(3);
        });

        it("Should get active listings", async function () {
            await cafeToken.connect(producer).listForSale(1, ethers.parseEther("1.0"));
            await cafeToken.connect(producer).listForSale(3, ethers.parseEther("2.0"));

            const [tokenIds, listings] = await cafeToken.getActiveListings();
            expect(tokenIds.length).to.equal(2);
            expect(tokenIds[0]).to.equal(1);
            expect(tokenIds[1]).to.equal(3);
            expect(listings[0].price).to.equal(ethers.parseEther("1.0"));
            expect(listings[1].price).to.equal(ethers.parseEther("2.0"));
        });

        it("Should get total minted", async function () {
            expect(await cafeToken.getTotalMinted()).to.equal(3);
        });
    });
});
