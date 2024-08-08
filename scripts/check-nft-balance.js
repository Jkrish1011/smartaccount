const hre = require("hardhat");

const ACCOUNT_ADDR = "0x48b8f744227837ecb655569f8c5321c4cb233f81";
const VISIONCHAIN_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const RECEIVER_ADDRESS = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

async function main() {
    const vs = await hre.ethers.getContractAt("Visionchain", VISIONCHAIN_ADDRESS);
    const balance = await vs.balanceOf(RECEIVER_ADDRESS);
    
    console.log(balance);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});