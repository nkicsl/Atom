pragma solidity ^0.4.0;

contract store{
    
    string prelog = 'abc';
    
    string log = 'bcd';
    
    int result = 0;
    
    function compare() public returns (int _res){
        
        result = 0;
        assembly{
            mstore(0,99)
        }
        if(keccak256(prelog)==keccak256(log)){
            result =1;
        }
        assembly{
            mstore(0,99)
        }
        return result;
    }
}