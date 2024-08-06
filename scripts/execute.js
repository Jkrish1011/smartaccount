const hre = require("hardhat");


const FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

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
        callData: Account.interface.encodeFunctionData("executeCustomLogic"), 
        callGasLimit: 400_000,
        verificationGasLimit: 400_000,
        preVerificationGas: 400_000,
        maxFeePerGas:hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("10", "gwei"),
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