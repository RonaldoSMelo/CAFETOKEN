const hre = require("hardhat");

async function main() {
    console.log("☕ CAFÉTOKEN - Script de Demonstração de Testes\n");
    console.log("=".repeat(60));

    // Get signers
    const [owner, producer, buyer] = await hre.ethers.getSigners();

    console.log("\n👥 Contas de Teste:");
    console.log("   Owner:    ", owner.address);
    console.log("   Producer: ", producer.address);
    console.log("   Buyer:    ", buyer.address);

    // Deploy contract
    console.log("\n📦 Fazendo deploy do contrato...");
    const CafeToken = await hre.ethers.getContractFactory("CafeToken");
    const cafeToken = await CafeToken.deploy();
    await cafeToken.waitForDeployment();
    const contractAddress = await cafeToken.getAddress();

    console.log("✅ Contrato deployado em:", contractAddress);
    console.log("   Nome:", await cafeToken.name());
    console.log("   Símbolo:", await cafeToken.symbol());
    console.log("   Taxa de Mint:", hre.ethers.formatEther(await cafeToken.mintFee()), "ETH");
    console.log("   Taxa de Marketplace:", (await cafeToken.marketplaceFee()).toString(), "basis points (3%)");

    // Test 1: Mint NFT
    console.log("\n" + "=".repeat(60));
    console.log("🧪 TESTE 1: Mintando NFT de Café");
    console.log("=".repeat(60));

    const mintFee = await cafeToken.mintFee();
    const lot1 = {
        tokenURI: "ipfs://QmSampleCoffee1",
        lotCode: "BR-MG-2024-001",
        weightKg: 300,
        scaScore: 8500, // 85.00 points
        harvestTimestamp: Math.floor(Date.now() / 1000),
        qualityReportHash: "QmQualityReport1"
    };

    console.log("\n📝 Dados do Lote:");
    console.log("   Código:", lot1.lotCode);
    console.log("   Peso:", lot1.weightKg, "kg");
    console.log("   Score SCA:", (lot1.scaScore / 100).toFixed(2), "pontos");

    const tx1 = await cafeToken.connect(producer).mintCoffeeLot(
        lot1.tokenURI,
        lot1.lotCode,
        lot1.weightKg,
        lot1.scaScore,
        lot1.harvestTimestamp,
        lot1.qualityReportHash,
        { value: mintFee }
    );

    await tx1.wait();
    console.log("✅ NFT #1 mintado com sucesso!");
    console.log("   Proprietário:", await cafeToken.ownerOf(1));
    console.log("   Total mintado:", (await cafeToken.getTotalMinted()).toString());

    // Test 2: Mint second NFT
    console.log("\n" + "=".repeat(60));
    console.log("🧪 TESTE 2: Mintando Segundo NFT");
    console.log("=".repeat(60));

    const lot2 = {
        tokenURI: "ipfs://QmSampleCoffee2",
        lotCode: "BR-ES-2024-002",
        weightKg: 250,
        scaScore: 8700,
        harvestTimestamp: Math.floor(Date.now() / 1000),
        qualityReportHash: "QmQualityReport2"
    };

    const tx2 = await cafeToken.connect(producer).mintCoffeeLot(
        lot2.tokenURI,
        lot2.lotCode,
        lot2.weightKg,
        lot2.scaScore,
        lot2.harvestTimestamp,
        lot2.qualityReportHash,
        { value: mintFee }
    );

    await tx2.wait();
    console.log("✅ NFT #2 mintado com sucesso!");
    console.log("   Total mintado:", (await cafeToken.getTotalMinted()).toString());

    // Test 3: List for sale
    console.log("\n" + "=".repeat(60));
    console.log("🧪 TESTE 3: Listando NFT para Venda");
    console.log("=".repeat(60));

    const listingPrice = hre.ethers.parseEther("1.5");
    const tx3 = await cafeToken.connect(producer).listForSale(1, listingPrice);
    await tx3.wait();

    console.log("✅ NFT #1 listado para venda!");
    console.log("   Preço:", hre.ethers.formatEther(listingPrice), "ETH");

    const listing = await cafeToken.getListing(1);
    console.log("   Vendedor:", listing.seller);
    console.log("   Status:", listing.active ? "Ativo" : "Inativo");

    // Test 4: Get active listings
    console.log("\n" + "=".repeat(60));
    console.log("🧪 TESTE 4: Consultando Listagens Ativas");
    console.log("=".repeat(60));

    const [tokenIds, listings] = await cafeToken.getActiveListings();
    console.log("✅ Listagens ativas:", tokenIds.length);

    for (let i = 0; i < tokenIds.length; i++) {
        console.log(`\n   NFT #${tokenIds[i]}:`);
        console.log("   Preço:", hre.ethers.formatEther(listings[i].price), "ETH");
        console.log("   Vendedor:", listings[i].seller);
    }

    // Test 5: Buy NFT
    console.log("\n" + "=".repeat(60));
    console.log("🧪 TESTE 5: Comprando NFT");
    console.log("=".repeat(60));

    const buyerBalanceBefore = await hre.ethers.provider.getBalance(buyer.address);
    const producerBalanceBefore = await hre.ethers.provider.getBalance(producer.address);

    console.log("\n💰 Saldos antes da compra:");
    console.log("   Comprador:", hre.ethers.formatEther(buyerBalanceBefore), "ETH");
    console.log("   Vendedor:", hre.ethers.formatEther(producerBalanceBefore), "ETH");

    const tx4 = await cafeToken.connect(buyer).buyNFT(1, { value: listingPrice });
    await tx4.wait();

    console.log("\n✅ NFT #1 comprado com sucesso!");
    console.log("   Novo proprietário:", await cafeToken.ownerOf(1));

    const buyerBalanceAfter = await hre.ethers.provider.getBalance(buyer.address);
    const producerBalanceAfter = await hre.ethers.provider.getBalance(producer.address);

    console.log("\n💰 Saldos depois da compra:");
    console.log("   Comprador:", hre.ethers.formatEther(buyerBalanceAfter), "ETH");
    console.log("   Vendedor:", hre.ethers.formatEther(producerBalanceAfter), "ETH");

    const marketplaceFee = (listingPrice * BigInt(300)) / BigInt(10000);
    const sellerAmount = listingPrice - marketplaceFee;

    console.log("\n💸 Detalhes da transação:");
    console.log("   Preço total:", hre.ethers.formatEther(listingPrice), "ETH");
    console.log("   Taxa marketplace (3%):", hre.ethers.formatEther(marketplaceFee), "ETH");
    console.log("   Valor para vendedor:", hre.ethers.formatEther(sellerAmount), "ETH");

    // Test 6: Redeem coffee
    console.log("\n" + "=".repeat(60));
    console.log("🧪 TESTE 6: Resgatando Café Físico");
    console.log("=".repeat(60));

    const tx5 = await cafeToken.connect(buyer).redeemCoffee(1);
    await tx5.wait();

    console.log("✅ Café resgatado com sucesso!");

    const redeemedLot = await cafeToken.getCoffeeLot(1);
    console.log("   Código do lote:", redeemedLot.lotCode);
    console.log("   Status:", redeemedLot.redeemed ? "Resgatado" : "Disponível");
    console.log("   Proprietário final:", await cafeToken.ownerOf(1));

    // Test 7: Get tokens by owner
    console.log("\n" + "=".repeat(60));
    console.log("🧪 TESTE 7: Consultando NFTs por Proprietário");
    console.log("=".repeat(60));

    const producerTokens = await cafeToken.getTokensByOwner(producer.address);
    const buyerTokens = await cafeToken.getTokensByOwner(buyer.address);

    console.log("\n📊 NFTs do Produtor:", producerTokens.length);
    for (let i = 0; i < producerTokens.length; i++) {
        console.log(`   - NFT #${producerTokens[i]}`);
    }

    console.log("\n📊 NFTs do Comprador:", buyerTokens.length);
    for (let i = 0; i < buyerTokens.length; i++) {
        const lot = await cafeToken.getCoffeeLot(buyerTokens[i]);
        console.log(`   - NFT #${buyerTokens[i]} (${lot.lotCode})`);
    }

    // Test 8: Admin functions
    console.log("\n" + "=".repeat(60));
    console.log("🧪 TESTE 8: Funções Administrativas");
    console.log("=".repeat(60));

    // Verify producer
    const tx6 = await cafeToken.connect(owner).setProducerVerification(producer.address, true);
    await tx6.wait();
    console.log("✅ Produtor verificado!");
    console.log("   Status:", await cafeToken.verifiedProducers(producer.address) ? "Verificado" : "Não verificado");

    // Withdraw fees
    const contractBalance = await hre.ethers.provider.getBalance(contractAddress);
    console.log("\n💰 Saldo do contrato:", hre.ethers.formatEther(contractBalance), "ETH");

    if (contractBalance > 0) {
        const tx7 = await cafeToken.connect(owner).withdraw();
        await tx7.wait();
        console.log("✅ Fundos sacados com sucesso!");

        const newBalance = await hre.ethers.provider.getBalance(contractAddress);
        console.log("   Novo saldo do contrato:", hre.ethers.formatEther(newBalance), "ETH");
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 RESUMO FINAL");
    console.log("=".repeat(60));
    console.log("\n✅ Todos os testes executados com sucesso!");
    console.log("\n📈 Estatísticas:");
    console.log("   Total de NFTs mintados:", (await cafeToken.getTotalMinted()).toString());
    console.log("   NFTs do produtor:", producerTokens.length);
    console.log("   NFTs do comprador:", buyerTokens.length);
    console.log("   Listagens ativas:", (await cafeToken.getActiveListings())[0].length);

    console.log("\n" + "=".repeat(60));
    console.log("🎉 Demonstração concluída!");
    console.log("=".repeat(60) + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Erro:", error);
        process.exit(1);
    });
