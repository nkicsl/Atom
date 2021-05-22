var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var fs = require('fs');

var tips = process.argv[2];
var start;


var policyAddr = '0xe54e8ac74bdeab2fcdd909b5caa8d81b10e3041d';
var policyAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "mode",
				"type": "uint256"
			}
		],
		"name": "modify",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_log1",
				"type": "string"
			},
			{
				"name": "_log2",
				"type": "string"
			}
		],
		"name": "main",
		"outputs": [
			{
				"name": "_res",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	}
];
function getModifyTime() {
    current = new Date().getTime();
	fs.appendFile("./time.txt", (current - start).toString() + '\n', function (err) {
		if (err) { throw err; }
	})
}

async function update(tips){
    start = new Date().getTime();
    for(i = 1; i <= tips; i++){
		var policyContract = new web3.eth.Contract(policyAbi,policyAddr);
		policyContract.methods.modify(1).send({ from: accounts[0] });
        console.log("update of No.%o contract success!", i);
        if((i % 500) == 0){
            getModifyTime();
        }
    }
}

async function main(){
    //await Ut.sleep(100);
    accounts = await web3.eth.getAccounts();
    //console.log(accounts[0]);
    console.log("get accounts success!");
    update(tips);
}

main();