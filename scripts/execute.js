const hre = require("hardhat");


const FACTORY_ADDRESS = "0xAB416e95fDA482A2cBde8C8Aca6b2A2e3Ff06C55"; 
// const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Local entrypoint
// Alchemy's entrypoint on arb sepolia testnet
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0xCfFB26ce5F42F562Ce08B1f7c7b734EdB6198CDc";

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
        sender = "0x" + ex.data.slice(-40);
    }

    console.log(`The Smart Account address is ${sender}`);
    console.log({sender});

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
        // nonce: await entrypoint.getNonce(sender, 0), // older version
        nonce: "0x" + (await entrypoint.getNonce(sender, 0)).toString(16), // for alchemy
        initCode,
        callData: Account.interface.encodeFunctionData("executeCustomLogic"), 
        paymasterAndData: PAYMASTER_ADDRESS,
        signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c" // dummy value for alchemy api
    };

    const {preVerificationGas, callGasLimit, verificationGasLimit} = await ethers.provider.send("eth_estimateUserOperationGas", [
        userOp,
        EP_ADDRESS
    ]);
    
    userOp.preVerificationGas = preVerificationGas;
    userOp.callGasLimit = callGasLimit;
    userOp.verificationGasLimit = verificationGasLimit;

    const {maxFeePerGas} = await ethers.provider.getFeeData();
    userOp.maxFeePerGas = "0x"+ maxFeePerGas.toString(16); // to get it as a hex encoded string for the alchemy api

    const maxPriorityFeePerGas = await ethers.provider.send("rundler_maxPriorityFeePerGas");
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

    const userOpHash = await entrypoint.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

    // eth_sendUserOperation - instead of sending the userop to entrypoint, we do it with the bundler service
    const opHash = await ethers.provider.send("eth_sendUserOperation", [userOp, EP_ADDRESS]);
    console.log(opHash);

    // Adding timeout to adjust for the time the bundler service is taking to execute the transaction.
    setTimeout(async () => {
        const { transactionHash } = await ethers.provider.send("eth_getUserOperationByHash", [opHash]);
        console.log(transactionHash);
    }, 5000);
    

    // console.log(userOp);
    // const tx = await entrypoint.handleOps([userOp], address0);
    // const receipt = await tx.wait();
    // console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});