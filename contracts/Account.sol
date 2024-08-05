//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";

contract Account is IAccount {
    uint256 public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    // This function is used to validate the user operation is coming from the owner and not from anyone else.
    // We can bring our own functionality to experiment with it.
    function validateUserOp(
        UserOperation calldata,
        bytes32,
        uint256
    ) external pure returns (uint256 validationData) {
        return 0;
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
