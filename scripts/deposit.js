const hre = require("hardhat");

//const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
//const PAYMASTER_ADDRESS = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";


async function main() {
    const entrypoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);


    await entrypoint.depositTo(PAYMASTER_ADDRESS, {
        value: hre.ethers.parseEther("1")
    });
    const balance = await entrypoint.balanceOf(PAYMASTER_ADDRESS);

    console.log('Deposit was successful for Paymaster in Entrypoint');
    console.log(`Paymaster balance in Entrypoint: ${balance}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});