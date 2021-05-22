pragma solidity ^0.4.3

contract ImplementationV2 is ImplementationV1 {
 
    function addPlayer(address _player, uint _points) 
        public onlyOwner 
    {
        require (points[_player] == 0);
        points[_player] = _points;
        totalPlayers++;
    }
}