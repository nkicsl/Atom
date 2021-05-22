var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var fs = require('fs');

var tips = process.argv[2];
var start;


var Addr = '0xb26dec278183dc043b1e8ee1768698b5712c9e4f';
var Abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newImplementation",
				"type": "address"
			}
		],
		"name": "upgradeTo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "implementation",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	}
];
function getTime() {
    current = new Date().getTime();
	fs.appendFile("./time.txt", (current - start).toString() + '\n', function (err) {
		if (err) { throw err; }
	})
}

async function excute(tips){
	start = new Date().getTime();
	var Contract = new web3.eth.Contract(Abi,Addr);
    for(i = 1; i <= tips; i++){	
		Contract.methods.upgradeTo('0x082aaab401eda8f85d8c0574967729228f05a52b').send({ from: accounts[0] }).on('receipt', function(receipt){
			getTime();
			console.log(receipt);
		});
    }
}

async function main(){
    accounts = await web3.eth.getAccounts();
    console.log("get accounts success!");
    excute(tips);
}

main();