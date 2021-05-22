pragma solidity ^0.4.26;

contract Controller{
    
    address bc;
    
    address dc;
    
    function setBc(address _bc) public{
        
        bc = _bc;
    }
    
     function setDc(address _dc) public{
        
        dc = _dc;
    }
    
    function getData() public constant returns(string _log1, string _log2, uint _t){
        
        (_log1, _log2, _t) = Data(dc).getData();
        
        return (_log1, _log2, _t);
    }
}

contract Data{
    
    address bc;
    
    mapping(address => string)Logs1;
    
    mapping(address => string)Logs2;
    
    mapping(address => uint)Times;
    
    
    function setBc(address _bc) public{
        
        bc = _bc;
    }
    
    function getData() public constant returns(string _log1, string _log2, uint _t){
        
        _log1 = Logs1[bc];
        
        _log2 = Logs1[bc];
        
        _t = Times[bc];
        
        return (_log1,_log2,_t);
    }
    
    function setData(string _log1, string _log2, uint _t) public{
        
        Logs1[bc] = _log1;
        
        Logs2[bc] = _log2;
        
        Times[bc] = _t;
    }
}

contract Business{
    
    address cc;
    
    function setCc(address _cc) public{
        
        cc = _cc;
    }
    
    function check(string _log1,string _log2) public constant returns(string _a){
    
        string memory _l1;
    
        string memory _l2;
    
        uint _t;
    
        (_l1, _l2, _t) = Controller(cc).getData();
    
        uint _count = 0;

        for(uint i = 0; i < _t; i++){
            
            if(keccak256(_log1) == keccak256(_l1)){
        
            _count++;
            }

        }
        
        if(_count == _t){
            
            return _a;
        }
    }
}
