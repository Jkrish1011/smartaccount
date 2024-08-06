const hre = require("hardhat");

const ACCOUNT_ADDR = "0x91d50cd9964b97283a97e3d6fccd9ff1559f2297";
const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
    const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
    const count = await account.count();

    console.log(count);

    // To check the balance of Paymaster
    console.log(`account-balance`, await hre.ethers.provider.getBalance(ACCOUNT_ADDR));

    // To check the balance of Entrypoint
    const entrypoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
    console.log(`account-balance-ep`, await entrypoint.balanceOf(ACCOUNT_ADDR));
    
    // To check the balance of Paymaster
    console.log(`account-balance-ep`, await entrypoint.balanceOf(PAYMASTER_ADDRESS));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});