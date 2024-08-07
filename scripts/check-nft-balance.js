const hre = require("hardhat");

const ACCOUNT_ADDR = "0x48b8f744227837ecb655569f8c5321c4cb233f81";
const VISIONCHAIN_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const RECEIVER_ADDRESS = "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f";

async function main() {
    const vs = await hre.ethers.getContractAt("Visionchain", VISIONCHAIN_ADDRESS);
    const balance = await vs.balanceOf(RECEIVER_ADDRESS);
    
    console.log(balance);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});