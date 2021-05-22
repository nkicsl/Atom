var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8547"));
var fs = require('fs');
var readline = require('readline');
var Ut = require('./sleep');
//Solidity-compiler
var solc = require('solc')

var srcfile1 = './C1.txt';
var content1;
var start;
var stop;

fs.readFile(srcfile1,'utf-8',function(err,data){
    if(err){
        console.log(err);
    }else{
        content1 = data;
        //console.log(data);
    }
})

function getModifyTime() {
	fs.appendFile("./time.txt", (stop - start).toString() + '\n', function (err) {
		if (err) { throw err; }
	})
}

async function deploy(){
    start = new Date().getTime();
    for(i = 1; i <= 1; i++){
        var input = { 'contract.sol': content1 };
        var compiledContract = solc.compile({ sources: input }, 1);
        //console.log(compiledContract.contracts['contract.sol:ASC']);
        var abi = compiledContract.contracts['contract.sol:ASC'].interface;
        var bytecode = '0x' + compiledContract.contracts['contract.sol:ASC'].bytecode;
        //console.log("get options of No.%o contract success!", i);
        stop = new Date().getTime();
        console.log((stop-start).toString());
        getModifyTime();
        var Contract = new web3.eth.Contract(JSON.parse(abi)).deploy({ data: bytecode }).send({ from: accounts[0], gasLimit: 500000 });
        console.log("deploy of No.%o contract success!", i);
        if((i % 600) == 0){
            stop = new Date().getTime();
            getModifyTime();
        }
    }
}

async function main(){
    await Ut.sleep(100);
    accounts = await web3.eth.getAccounts();
    //console.log(accounts[0]);
    console.log("get accounts success!");
    deploy();
}

main();