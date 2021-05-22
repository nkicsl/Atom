pragma solidity ^0.4.0;

contract SINGLE{
  
  function check(string _log1, string _log2) public constant returns(string _a){

    uint _count = 0;

    if(keccak256(_log1) == keccak256("1.1.1.1 SYN_RECV")){

      _count++;

    }

    if(_count == 1){

      return "1.1.1.1,'BLOCKING'";

    }
  }
}