var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var fs = require('fs');

var tips = process.argv[2];
var start;


var Addr = '0xe577910099e43f2bedaec713e285cf7214ada52e';
var Abi = [
	{
		"constant": true,
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
		"name": "check",
		"outputs": [
			{
				"name": "_a",
				"type": "string"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
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
		Contract.methods.check("1.1.1.1 SYN_RECV","").call({ from: accounts[0] });
        console.log("update of No.%o contract success!", i);
        if((i == 1)||(i % 250) == 0){
            getTime();
        }
    }
}

async function main(){
    accounts = await web3.eth.getAccounts();
    console.log("get accounts success!");
    excute(tips);
}

main();