const hre = require("hardhat");

async function main() {
  const vc = await hre.ethers.getContractFactory("Visionchain");
  const visionchainContractDeployed = await vc.deploy("Visionchain", "VCAI");
  await visionchainContractDeployed.waitForDeployment();
  console.log(`Visionchain NFT Contract deployed to ${visionchainContractDeployed.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});