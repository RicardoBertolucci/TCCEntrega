const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const SoybeanTrade = await hre.ethers.getContractFactory("SoybeanTrade");
  
  // Deploy do contrato
  const soybeanTrade = await SoybeanTrade.deploy();

  console.log("Contrato SoybeanTrade implantado em:", soybeanTrade.target);

  // Salvar o endereço do contrato em um arquivo JSON
  const contractAddressPath = path.join(__dirname, "../frontend/src/contract-address.json");
  fs.writeFileSync(contractAddressPath, JSON.stringify({ SoybeanTrade: soybeanTrade.target }, undefined, 2));

  console.log("Endereço do contrato salvo em:", contractAddressPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
