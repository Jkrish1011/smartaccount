const hre = require("hardhat");

const ACCOUNT_ADDR = "0x92a155d606c3edc6bda577b1067a62d5c8062375";
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0xCfFB26ce5F42F562Ce08B1f7c7b734EdB6198CDc";

async function main() {
    const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
    const count = await account.count();
    
    console.log(count);

    // To check the balance of Paymaster
    console.log(`account-balance-pm`, await hre.ethers.provider.getBalance(ACCOUNT_ADDR));

    // To check the balance of Entrypoint
    const entrypoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
    console.log(`account-balance-ep`, await entrypoint.balanceOf(ACCOUNT_ADDR));
    
    // To check the balance of Paymaster
    console.log(`account-balance-pm`, await entrypoint.balanceOf(PAYMASTER_ADDRESS));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});