const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CafeToken contract...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deployer address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy CafeToken
  const CafeToken = await hre.ethers.getContractFactory("CafeToken");
  const cafeToken = await CafeToken.deploy();
  
  await cafeToken.waitForDeployment();
  const address = await cafeToken.getAddress();
  
  console.log("✅ CafeToken deployed to:", address);
  console.log("\n📋 Contract Details:");
  console.log("   Name:", await cafeToken.name());
  console.log("   Symbol:", await cafeToken.symbol());
  console.log("   Mint Fee:", hre.ethers.formatEther(await cafeToken.mintFee()), "ETH");
  console.log("   Marketplace Fee:", (await cafeToken.marketplaceFee()).toString(), "basis points (", Number(await cafeToken.marketplaceFee()) / 100, "%)");
  
  console.log("\n📝 Save this address in your .env file:");
  console.log(`   VITE_CONTRACT_ADDRESS=${address}`);
  
  // Wait for confirmations before verifying
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await cafeToken.deploymentTransaction().wait(6);
    
    console.log("\n🔍 Verifying contract on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("⚠️ Verification failed:", error.message);
    }
  }
  
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

