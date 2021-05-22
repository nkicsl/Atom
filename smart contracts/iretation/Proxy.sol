pragma solidity ^0.4.26;

contract StorageStructure {
    address public implementation;
    address public owner;
}

contract Implementation is StorageStructure {
    modifier onlyOwner() {
        require (msg.sender == owner);
        _;
    }

    function check(string _log1, string _log2, uint _t) public constant returns(string _a){

        uint _count = 0;

        for(uint i = 0; i < 10*_t; i++){

            if(keccak256(_log1) == keccak256("1.1.1.1 SYN_RECV") && keccak256(_log2) == keccak256("2.2.2.2 SYN_RECV")){

            _count ++ ;

            }

        }

        if(_count == 10*_t){

            return "1.1.1.1,'BLOCKING'";
        }
    }

}

contract Proxy is StorageStructure {
    
    modifier onlyOwner() {
        require (msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function upgradeTo(address _newImplementation) 
        external onlyOwner 
    {
        require(implementation != _newImplementation);
        _setImplementation(_newImplementation);
    }
    
    function () payable public {
        address impl = implementation;
        require(impl != address(0));
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, impl, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)
            
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }

    function _setImplementation(address _newImp) internal {
        implementation = _newImp;
    }
}