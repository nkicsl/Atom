var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8547"));
var fs = require('fs');
var path = require('path');

var contractAddr = '0x297f8dad8541740b72228207953b5bdfd1ff939f';
var contractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "opt",
				"type": "int256"
			}
		],
		"name": "modify",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getWeight",
		"outputs": [
			{
				"name": "ret",
				"type": "int256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "priority",
				"type": "int256"
			}
		],
		"name": "insert",
		"outputs": [
			{
				"name": "ret",
				"type": "int256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "init",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	}
];

var start;
var stop;

function getLedgerSize() {
    var filepath = "./data/geth/chaindata/"
    var filedir = fs.readdirSync("./data/geth/chaindata");
    filedir.forEach(function (item, index) {
        if (path.extname(item) == '.log') {
            var stateInfo = fs.statSync(filepath + path.basename(item));
            fs.appendFile("./ledgersize2.txt", String(stateInfo.size) + '\n', function (err) {
                if (err) { throw err; }
            })
        }
    })
}

function getModifyTime() {
	fs.appendFile("./time.txt", (stop - start).toString() + '\n', function (err) {
		if (err) { throw err; }
	})
}

async function main(){
    var accounts = await web3.eth.getAccounts();
	if (accounts != '') {
		console.log("Got server addr " + accounts[0] + ".");
	} else {
		console.log("Failed to get server addr!");
    }
    //getLedgerSize();
    var contract = new web3.eth.Contract(contractAbi, contractAddr);
    console.log("Got contract interface.");
    
    console.log("Start upload...");
    start = new Date().getTime();
	for (i = 1; i <= 4000; i++) {
		contract.methods.modify(1).send({ from: accounts[0] });
		console.log("No." + i + " is modified over");
		if((i % 1000) == 0){
			//getLedgerSize();
			stop = new Date().getTime();
			getModifyTime();
		}
	}
}

main();