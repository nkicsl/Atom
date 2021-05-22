var fs = require("fs");
var os = require('os');
var OS = require('os-utils');
var Ut = require('./sleep');

async function main() {
    var i = 0;
    var memusage = (os.totalmem() - os.freemem()) / os.totalmem();
    if (fs.existsSync("./memory.txt")) {
        fs.unlinkSync("./memory.txt");
    }
    if (fs.existsSync("./cpu.txt")) {
        fs.unlinkSync("./cpu.txt");
    }

    while (true) {
        OS.cpuUsage(function (v) {
            fs.appendFile('memory.txt', memusage + "\n", function (err) {
                if (err) throw err;
            });
            fs.appendFile('cpu.txt', v + "\n", function (err) {
                if (err) throw err;
            })
        });
        await Ut.sleep(1);
    }
}
main();