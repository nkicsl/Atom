var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var fs = require('fs');
var path = require('path');
let Ut = require('./sleep');

function getLedgerSize() {
    var filepath = "./data/geth/chaindata/"
    var filedir = fs.readdirSync("./data/geth/chaindata");
    filedir.forEach(function (item, index) {
        if (path.extname(item) == '.log') {
            var stateInfo = fs.statSync(filepath + path.basename(item));
            fs.appendFile("./ledgersize.txt", String(stateInfo.size) + '\n', function (err) {
                if (err) { throw err; }
            })
        }
    })
}

async function run() {
    while (true) {
        getLedgerSize();
        await Ut.sleep(1000);
    }
}

run();
