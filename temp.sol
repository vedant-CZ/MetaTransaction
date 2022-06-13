// SPDX-License-Identifier:MIT

pragma solidity  ^0.8.4;

import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract temp is BaseRelayRecipient {
 
    string private message;
    constructor(address _trustedForwarder) {
        _setTrustedForwarder(_trustedForwarder);
        message="Hello Guys";
    }
    
    function versionRecipient() external view override returns (string memory) {
        return "1";
    }

    function getMessage() public view returns(string memory){
      return message;
    }

    function setMessage(string memory newMessage) public{
      message=newMessage;
    }
}