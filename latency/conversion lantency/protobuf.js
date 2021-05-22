var fs = require('fs');
var readline = require('readline');
var PB = require('protobufjs');

var policyfile = './policy.txt';
var filesrc;

/*
The format of policy is as follows: 
[Mode] ['Src Action';'Src Action';'Src Action',Value] [Src,'Command']
*/
var Modes = [];
var Srcs = [];
var Actions = [];
var Values = [];
var Commands = [];
var Names = [];
var accounts;
var Seq_Actions = [];
var Seq_Count = [];
var Seq_Srcs = [];
//get time
var start;
var stop;
var tips = process.argv[2];
var messages = [];
var Contents = [];

function readfile(policyfile, cb) {
    var fileString = [];
    var fRead = fs.createReadStream(policyfile);
    var Readline = readline.createInterface({
        input: fRead,
    });
    var index = 0;
    Readline.on('line', (line) => {
        fileString.push(JSON.parse(line));
    });
    Readline.on('close', () => {
        console.log('file read success!');
        cb(fileString);
    })
}

function init(fileString) {
    if (fileString.length == 0) {
        console.log("Policy file is empty!");
    }
    else {
        filesrc = fileString;
        console.log("initialization success!");
        getMessage(tips);
    }
}

function getMessage(tips) {
    PB.load("./policy.proto", function (err, root) {
        if (err)
            throw err;
        var PolicyMessage = root.lookupType("policypackage.PolicyMessage");

        for(index = 0; index < tips; index++){
            var payload = filesrc[index];
            var errMsg = PolicyMessage.verify(payload);
            if (errMsg)
                throw Error(errMsg);
            messages[index] = PolicyMessage.create(payload);
        }
        conversion(tips); 
    })
}

async function conversion(tips) {
    start = new Date().getTime();
    for (index = 0; index < tips; index++) {
        Modes[index] = messages[index].Type;
        if (Modes[index] == "LOOP") {
            var str = messages[index].Condition.split(' ');
            Srcs[index] = str[0];
            Actions[index] = str[1];
            Values[index] = messages[index].Time;
            Commands[index] = messages[index].Action.split(',')[1].slice(1, -1);
            Names[index] = Modes[index] + '_' + index;
            content =
                "pragma solidity ^0.4.0;\n" +
                "contract " + Names[index] + "{\n" +
                "    uint count;\n" +
                "    string Command;\n" +
                "    function check(string _src, string _action) public {\n" +
                "        if(keccak256(_src) == keccak256(\"" + Srcs[index] + "\") && " + "keccak256(_action) == keccak256(\"" + Actions[index] + "\")){\n" +
                "            count++;\n" +
                "        }\n" +
                "        if(count == " + Values[index] + "){\n" +
                "            setCommand(\"" + Commands[index].toLowerCase() + " " + Srcs[index] + "\");\n" +
                "        }\n" +
                "    }\n" +
                "    function setCommand(string _command) public{\n" +
                "        Command = _command;\n" +
                "    }\n" +
                "    function getCommand() public constant returns(string _command){\n" +
                "        _command = Command;\n" +
                "    }\n" +
                "}";
        }
        else if (Modes[index] == "SEQU") {
            Values[index] = messages[index].Time;
            Commands[index] = messages[index].Action.split(',')[1].slice(1, -1);
            Names[index] = Modes[index] + '_' + index;
            Seq_Count[index] = 3;
            Seq_Srcs[0] = messages[index].condition1.split(' ')[0];
            Seq_Actions[0] = messages[index].condition1.split(' ')[1];
            Seq_Srcs[1] = messages[index].condition2.split(' ')[0];
            Seq_Actions[1] = messages[index].condition2.split(' ')[1];
            Seq_Srcs[2] = messages[index].condition3.split(' ')[0];
            Seq_Actions[2] = messages[index].condition3.split(' ')[1];
            content =
                "pragma solidity ^0.4.0;\n" +
                "contract " + Names[index] + "{\n" +
                "    uint count;\n" +
                "    uint truecount;\n" +
                "    string Command = \"" + Commands[index] + "\";\n" +
                "    mapping(uint => string) Srcs;\n" +
                "    mapping(uint => string) Actions;\n" +
                "    uint value =  " + Values[index] + ";\n" +
                "    string src1 = \"" + Seq_Srcs[0] + "\";\n" +
                "    string action1 = \"" + Seq_Actions[0] + "\";\n" +
                "    string src2 = \"" + Seq_Srcs[1] + "\";\n" +
                "    string action2 = \"" + Seq_Actions[1] + "\";\n" +
                "    string src3 = \"" + Seq_Srcs[2] + "\";\n" +
                "    string action3 = \"" + Seq_Actions[2] + "\";\n" +
                "    function check(string _src,string _action) public {\n" +
                "        Srcs[count] = _src;\n" +
                "        Actions[count] = _action;\n" +
                "        count ++;\n" +
                "        if(count >= value){\n" +
                "            if(equal(count,src1,action1)&&equal(count-1,src2,action2)&&equal(count-2,src3,action3)){\n" +
                "                truecount++;\n" +
                "            }\n" +
                "        }\n" +
                "        if(truecount == value){\n" +
                "            setCommand(Command);\n" +
                "        }\n" +
                "    }\n" +
                "    function equal(uint _count,string _src,string _action) public constant returns(bool _result){\n" +
                "        _result = false;\n" +
                "        if(keccak256(Srcs[_count]) == keccak256(_src) && keccak256(Actions[_count]) == keccak256(_action)){\n" +
                "        _result = true;\n" +
                "        }\n" +
                "    }\n" +
                "    function setCommand(string _command) public{\n" +
                "        Command = _command;\n" +
                "    }\n" +
                "}\n";
        }
        else if (Modes[index] == "SINGLE") {
            Srcs[index] = messages[index].Condition.split(' ')[0];
            Actions[index] = messages[index].Condition.split(' ')[1];
            Values[index] = messages[index].Time;
            Commands[index] = messages[index].Action.split(',')[1].slice(2, -1);
            Names[index] = Modes[index] + '_' + index;
            content =
                "pragma solidity ^0.4.0;\n" +
                "contract " + Names[index] + "{\n" +
                "    uint count;\n" +
                "    uint truecount;\n" +
                "    string Command;\n" +
                "    function check(string _src, string _action) public {\n" +
                "        if(keccak256(_src) == keccak256(\"" + Srcs[index] + "\") && keccak256(_action) == keccak256(\"" + Actions[index] + "\")){\n" +
                "            truecount++;\n" +
                "        }\n" +
                "        if(truecount == " + Values[index] + "){\n" +
                "            setCommand(\"" + Commands[index].toLowerCase() + " " + Srcs[index] + "\");\n" +
                "        }\n" +
                "        count++;\n" +
                "    }\n" +
                "    function setCommand(string _command) public{\n" +
                "        Command = _command;\n" +
                "    }\n" +
                "    function getCommand() public constant returns(string _command){\n" +
                "        _command = Command;\n" +
                "    }\n" +
                "}";
        }
        Contents[index] = content;
        console.log("conversion of No.%o contract success!", index + 1);
        if ((index + 1) % 600 == 0) {
            current = new Date().getTime();
            fs.appendFile('./conversion.txt', String(current - start) + "\n", function (err) {
                if (err) throw err;
            })
        }
    }
}

function compile(tips) {
    start = new Date().getTime();
    for (index = 0; index < tips; index++) {
        content = Contents[index];
        console.log(content);
        var input = { 'contract.sol': content };
        var compiledContract = solc.compile({ sources: input }, 1);
        console.log("compile of No.%o contract success!", index + 1);
        if ((index + 1) % 600 == 0) {
            current = new Date().getTime();
            fs.appendFile('./compile.txt', String(current - start) + "\n", function (err) {
                if (err) throw err;
            })
        }
    }
}

function main() {
    readfile(policyfile, function (fileString) {
        init(fileString);
    });
}

main();