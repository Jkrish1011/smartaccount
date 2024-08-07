const hre = require("hardhat");

// const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const EP_ADDRESS = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
const PAYMASTER_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

async function main() {
    const entrypoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);


    await entrypoint.depositTo(PAYMASTER_ADDRESS, {
        value: hre.ethers.parseEther("5")
    });

    console.log('Deposit was successful for Paymaster in Entrypoint');

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});