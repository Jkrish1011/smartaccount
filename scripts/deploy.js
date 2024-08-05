const hre = require("hardhat");

async function main() {
  const af = await hre.ethers.deployContract("AccountFactory");
  await af.waitForDeployment();
  console.log(`Account Factory deployed to ${af.target}`);

  const entrypoint = await hre.ethers.deployContract("EntryPoint");
  await entrypoint.waitForDeployment();
  console.log(`EntryPoint deployed to ${entrypoint.target}`);

  const paymaster = await hre.ethers.deployContract("Paymaster");
  await paymaster.waitForDeployment();
  console.log(`Paymaster deployed to ${paymaster.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});