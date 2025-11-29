const hre = require("hardhat");

async function main() {
  console.log("🔍 Consultando NFTs do CafeToken...\n");

  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  const CafeToken = await hre.ethers.getContractFactory("CafeToken");
  const contract = CafeToken.attach(CONTRACT_ADDRESS);

  // Informações gerais
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalMinted = await contract.getTotalMinted();
  
  console.log("📋 Informações do Contrato:");
  console.log(`   Nome: ${name}`);
  console.log(`   Símbolo: ${symbol}`);
  console.log(`   Total Mintado: ${totalMinted}`);
  console.log("");

  // Listar NFTs
  if (totalMinted > 0) {
    console.log("☕ NFTs Criados:");
    console.log("─".repeat(60));
    
    for (let i = 1; i <= totalMinted; i++) {
      try {
        const lot = await contract.getCoffeeLot(i);
        const owner = await contract.ownerOf(i);
        const tokenURI = await contract.tokenURI(i);
        const listing = await contract.getListing(i);
        
        console.log(`\n🏷️  Token #${i}`);
        console.log(`   Código: ${lot.lotCode}`);
        console.log(`   Produtor: ${lot.producer}`);
        console.log(`   Peso: ${lot.weightKg} kg`);
        console.log(`   SCA Score: ${Number(lot.scaScore) / 100}`);
        console.log(`   Resgatado: ${lot.redeemed ? 'Sim' : 'Não'}`);
        console.log(`   Owner atual: ${owner}`);
        console.log(`   À venda: ${listing.active ? `Sim (${hre.ethers.formatEther(listing.price)} ETH)` : 'Não'}`);
        
        // Decodificar URI se for data:
        if (tokenURI.startsWith('data:application/json,')) {
          const jsonStr = decodeURIComponent(tokenURI.replace('data:application/json,', ''));
          const metadata = JSON.parse(jsonStr);
          console.log(`   Nome: ${metadata.name}`);
        }
        
      } catch (error) {
        console.log(`   Erro ao ler token #${i}: ${error.message}`);
      }
    }
    
    console.log("\n" + "─".repeat(60));
  } else {
    console.log("ℹ️  Nenhum NFT criado ainda.");
  }

  // Saldo do contrato
  const balance = await hre.ethers.provider.getBalance(CONTRACT_ADDRESS);
  console.log(`\n💰 Saldo do Contrato: ${hre.ethers.formatEther(balance)} ETH`);
  
  console.log("\n✅ Consulta finalizada!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

