const hre = require("hardhat");


const FACTORY_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; 
const EP_ADDRESS = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
const PAYMASTER_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const VISIONCHAINNFT_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

async function main() {
    const [signer0] = await hre.ethers.getSigners();
    const address0 = await signer0.getAddress();
    const entrypoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

    
    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    
    let initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);;
    let sender;
    try{
        await entrypoint.getSenderAddress(initCode);
    }catch(ex){
        console.log(ex.data.data.slice(-40));
        sender = "0x" + ex.data.data.slice(-40);
    }

    console.log(`The Smart Account address is ${sender}`);

    const code = await ethers.provider.getCode(sender);
    if(code !== "0x"){
        // Deploying smart account for the first time
        initCode = "0x";
    } 


    const Account = await hre.ethers.getContractFactory("Account");

    // callData related to the part starting from the Smart Account - depends on what the user would want to be execute. any logic
    // struct PackedUserOperation {
    //     address sender;
    //     uint256 nonce;
    //     bytes initCode;
    //     bytes callData;
    //     bytes32 accountGasLimits;
    //     uint256 preVerificationGas;
    //     bytes32 gasFees;
    //     bytes paymasterAndData;
    //     bytes signature;
    // }
    // 0.7.0 version of aa
    // const userOp = {
    //     sender,
    //     nonce: await entrypoint.getNonce(sender, 0),
    //     initCode,
    //     callData: Account.interface.encodeFunctionData("executeCustomLogic"), 
    //     accountGasLimits: 200_000,
    //     preVerificationGas: 50_000,
    //     gasFees: hre.ethers.parseUnits("10", "gwei"),
    //     paymasterAndData: "0x",
    //     signature: "0x"
    // };
    

    // 0.6.0 version of aa
    let userOp = {
        sender,
        nonce: await entrypoint.getNonce(sender, 0),
        initCode,
        callData: Account.interface.encodeFunctionData("mintVisionChainNFT", ["0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", VISIONCHAINNFT_ADDRESS, hre.ethers.parseUnits("10", "gwei")]), 
        callGasLimit: 800_000,
        verificationGasLimit: 800_000,
        preVerificationGas: 800_000,
        maxFeePerGas:hre.ethers.parseUnits("20", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("20", "gwei"),
        paymasterAndData: PAYMASTER_ADDRESS,
        signature: "0x"
    };
    
    const userOpHash = await entrypoint.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

    console.log(userOp);
    const tx = await entrypoint.handleOps([userOp], address0);
    const receipt = await tx.wait();
    console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});