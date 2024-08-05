//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
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
    address public owner;

    constructor(address _owner) {
        owner = _owner;
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
}

contract AccountFactory {
    function createAccount(address _owner) external returns (address) {
        Account acc = new Account(_owner);
        return address(acc);
    }
}
