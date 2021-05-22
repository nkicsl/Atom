pragma solidity ^0.4.0;

contract store{
    
    int result = 0;
    
    function compare(string memory _prelog,string memory _log) public returns (int _res){
        
        result = 0;
        assembly{
            mstore(0,99)
        }
        if(keccak256(_prelog)==keccak256(_log)){
            result =1;
        }
        assembly{
            mstore(0,99)
        }
        return result;
    }
}