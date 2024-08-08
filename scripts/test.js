const hre = require("hardhat");

const ACCOUNT_ADDR = "0xe7c052da32fe52f884e3d94c3d8f988a770cc438";
const EP_ADDRESS = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
const PAYMASTER_ADDRESS = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";

async function main() {

  const nftContractAddress = "0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8";
    const tokenId = 1


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
    const tx = await account.mintNFT(nftContractAddress, tokenId);
    console.log("transaction", tx)
    console.log(`MintNFT transaction hash: ${tx.hash}`);

    await tx.wait();
    console.log('NFT minting confirmed!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});