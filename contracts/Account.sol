//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Visionchain.sol";

// import "hardhat/console.sol";

// contract Test {
//     constructor(bytes memory sig) {
//         address recovered = ECDSA.recover(
//             ECDSA.toEthSignedMessageHash(keccak256("wee")),
//             sig
//         );
//         console.log(recovered);
//     }
// }

contract Account is IAccount {
    uint256 public count;
   // address public nftContractAddress;
    address public owner;
    //uint256 public tokenId;

    constructor(address _owner) {
        owner = _owner;
        // nftContractAddress = _nftContractAddress;
        // tokenId = _tokenId;
    }

    // This function is used to validate the user operation is coming from the owner and not from anyone else.
    // We can bring our own functionality to experiment with it.
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256
    ) external view returns (uint256 validationData) {
        address recovered = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(userOpHash),
            userOp.signature
        );
        return owner == recovered ? 0 : 1;
    }

    function executeCustomLogic() external {
        count++;
    }

    function mintVisionChainNFT(
        address _receiverAddress,
        address _visionchainDeployedContractAddress,
        uint256 _amount
    ) external {
        Visionchain _vc = Visionchain(_visionchainDeployedContractAddress);
        _vc.mint(_receiverAddress, _amount);
    }
}

contract AccountFactory {
    function createAccount(address _owner) external returns (address) {
        bytes32 salt = bytes32(uint256(uint160(_owner)));
        bytes memory bytecode = abi.encodePacked(
            type(Account).creationCode,
            abi.encode(_owner)
        );

        address addr = Create2.computeAddress(salt, keccak256(bytecode));
        // To check if the account is already created(smart account already deployed)
        if (addr.code.length > 0) {
            return addr;
        }
        return Create2.deploy(0, salt, bytecode);
    }
}
