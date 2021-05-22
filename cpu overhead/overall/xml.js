var fs = require('fs');
var xmlreader = require('xmlreader');
var solc = require('solc')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var xmlfile = "./src2000.xml";
var filesrc;
var tips = process.argv[2];

//policy-format
var Subjects = [];
var Resources = [];
var Actions = [];
var Conditions = [];
var Srcs = [];
var Ops = [];
var Names = [];
var Contents = [];
//get time
var start;
var accounts;

var Abi1 = [
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
var Addr1 = '0x95c726462b2ec55c85b1685e229e65c720fdc6e5';
var Abi2 = [
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
var Addr2 = '0xa689db0b7470bbc31a2708a267002f838aa96dfe';
var Abi3 = [
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
var Addr3 = '0xf881be445f12b47276e21015e759f9a6cabbc88e';

var AbiProxy = [
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
var AddrProxy = '0xdff846227eab6c15d607b4c6f91d1cca7706e4ad';

var abi = [
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
var bytecode = "0x6060604052341561000c57fe5b5b6103528061001c6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063725dbc401461003b575bfe5b341561004357fe5b6100d6600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061015f565b6040518080602001828103825283818151815260200191508051906020019080838360008314610125575b80518252602083111561012557602082019150602081019050602083039250610101565b505050905090810190601f1680156101515780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610167610312565b60006000905060405180807f312e312e312e312053594e5f52454356000000000000000000000000000000008152506010019050604051809103902060001916846040518082805190602001908083835b602083106101db57805182526020820191506020810190506020830392506101b8565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020600019161480156102b5575060405180807f322e322e322e322053594e5f52454356000000000000000000000000000000008152506010019050604051809103902060001916836040518082805190602001908083835b60208310610282578051825260208201915060208101905060208303925061025f565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902060001916145b156102c35780806001019150505b600281141561030a57604060405190810160405280601281526020017f312e312e312e312c27424c4f434b494e47270000000000000000000000000000815250915061030b565b5b5092915050565b6020604051908101604052806000815250905600a165627a7a7230582087acd126bee6fd922096a89be8b3c69654e861170a820531b709cb6080939a0b0029";

function getTime() {
    current = new Date().getTime();
	fs.appendFile("./time.txt", current.toString() + '\n', function (err) {
		if (err) { throw err; }
	})
}

function searchSubStr(str, subStr) {
    var positions = new Array();
    var pos = str.indexOf(subStr);
    while (pos > -1) {
        positions.push(pos);
        pos = str.indexOf(subStr, pos + 1);
    }
    return positions;
}

function conversion(tips) {
    getTime();
    xmlreader.read(filesrc, function (err, res) {
        if (err) console.log(err);
        else {
            for (i = 0; i < tips; i++) {
                var rule = res.policies.policy.array[i].rule.target;
                Subjects[i] = rule.subject.text();
                Resources[i] = rule.resource.text();
                Actions[i] = rule.action.text();
                Conditions[i] = rule.condition.text();
                var pos = searchSubStr(Conditions[i], '$');
                var Src = new Array();
                for (j = 0; j < pos.length; j++) {
                    if (j == pos.length) {
                        Src.push(Conditions[i].slice(pos[j] + 1).split(' ')[0]);
                    } else {
                        Src.push(Conditions[i].slice(pos[j] + 1, pos[j + 1]).split(' ')[0]);
                    }
                }
                Srcs[i] = Src;
                Names[i] = "Rule" + '_' + i;
                content =
                    "pragma solidity ^0.4.0;\n" +
                    "contract " + Names[i] + "{\n" +
                    "    uint count;\n" +
                    "    string Command;\n" +
                    "    function check(string _src, string _action) public {\n" +
                    "        if(keccak256(_src) == keccak256(\"" + Srcs[i][0] + Srcs[i][1] + Srcs[i][2] + "\") && " + "keccak256(_action) == keccak256(\"" + Actions[i] + "\")){\n" +
                    "            count++;\n" +
                    "        }\n" +
                    "        if(count == " + Resources[i] + "){\n" +
                    "            setCommand(\"" + Subjects[i].toLowerCase() + " " + Srcs[i][0] + Srcs[i][1] + Srcs[i][2] + "\");\n" +
                    "        }\n" +
                    "    }\n" +
                    "    function setCommand(string _command) public{\n" +
                    "        Command = _command;\n" +
                    "    }\n" +
                    "    function getCommand() public constant returns(string _command){\n" +
                    "        _command = Command;\n" +
                    "    }\n" +
                    "}";
                Contents[i] = content;
                console.log("conversion of No.%o contract success!", i + 1);
            }
        }
    })
    getTime();
    compile(2000);
}

function compile(tips) {
    for (index = 0; index < tips; index++) {
        content = Contents[index];
        var input = { 'contract.sol': content };
        var compiledContract = solc.compile({ sources: input }, 1);
        console.log("compile of No.%o contract success!", index + 1);
    }
    getTime();
    update(2000);
}

function update(tips){
    for(i = 1; i <= tips; i++){
        var Contract = new web3.eth.Contract(abi).deploy({ data: bytecode }).send({ from: accounts[0], gasLimit: 500000 });
        var ContractProxy = new web3.eth.Contract(AbiProxy,AddrProxy);
		ContractProxy.methods.upgradeTo(Addr1).send({from: accounts[0]});
		ContractProxy.methods.upgradeTo(Addr2).send({from: accounts[0]});
		ContractProxy.methods.upgradeTo(Addr3).send({from: accounts[0]});
		console.log("update of No.%o contract success!", i);
    }
    getTime();
    excute(2000);
}

function excute(tips){
    var Contract1 = new web3.eth.Contract(Abi1,Addr1);
    var Contract2 = new web3.eth.Contract(Abi2,Addr2);
    var Contract3 = new web3.eth.Contract(Abi3,Addr3);
    for(i = 1; i <= tips; i+=3){	
        Contract1.methods.check("1.1.1.1 SYN_RECV","").call({ from: accounts[0]});
        Contract2.methods.check("1.1.1.1 SYN_RECV","").call({ from: accounts[0]});
        Contract3.methods.check("1.1.1.1 SYN_RECV","").call({ from: accounts[0]});
        console.log("execute of No.%o contract success!", i);
        console.log("execute of No.%o contract success!", i+1);
        console.log("execute of No.%o contract success!", i+2);
    }
    getTime();
}

async function run() {
    accounts = await web3.eth.getAccounts();
    console.log("get accounts success!");
    fs.readFile(xmlfile, function (err, data) {
        if (err)
            console.log(err);
        else {
            filesrc = data.toString();
            console.log("init over");
            conversion(2000);
        }
    })
}

run();
