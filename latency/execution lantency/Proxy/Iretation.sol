pragma solidity ^0.4.0;

contract SEQU{

    function check(string _log1, string _log2) public constant returns(string _a){

        uint _count = 0;

        for(uint i = 0; i < 10; i++){

            if(keccak256(_log1) == keccak256("1.1.1.1 SYN_RECV") && keccak256(_log2) == keccak256("2.2.2.2 SYN_RECV")){

            _count ++ ;

            }

        }

        if(_count == 10){

            return "1.1.1.1,'BLOCKING'";
        }
    }
}