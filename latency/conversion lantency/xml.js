var fs = require('fs');
var xmlreader = require('xmlreader');
//var Ut = require('./sleep');
var solc = require('solc')

var xmlfile = "./src6000.xml";
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
    start = new Date().getTime();
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
                /*if ((i + 1) % 600 == 0) {
                    current = new Date().getTime();
                    fs.appendFile('./conversion.txt', String(current - start) + "\n", function (err) {
                        if (err) throw err;
                    })
                }*/
            }
        }
    })
}

function compile(tips) {
    start = new Date().getTime();
    for (index = 0; index < tips; index++) {
        content = Contents[index];
        var input = { 'contract.sol': content };
        var compiledContract = solc.compile({ sources: input }, 1);
        console.log("compile of No.%o contract success!", index + 1);
        /*
        if ((index + 1) % 600 == 0) {
            current = new Date().getTime();
            fs.appendFile('./compile.txt', String(current - start) + "\n", function (err) {
                if (err) throw err;
            })
        }*/
    }
}
function run() {
    fs.readFile(xmlfile, function (err, data) {
        if (err)
            console.log(err);
        else {
            filesrc = data.toString();
            console.log("init over");
            conversion(tips);
            compile(tips);
        }
    })
}

run();
