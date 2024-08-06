const hre = require("hardhat");

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0xCfFB26ce5F42F562Ce08B1f7c7b734EdB6198CDc";

async function main() {
    const entrypoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);


    await entrypoint.depositTo(PAYMASTER_ADDRESS, {
        value: hre.ethers.parseEther("0.05")
    });

    console.log('Deposit was successful for Paymaster in Entrypoint');

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});