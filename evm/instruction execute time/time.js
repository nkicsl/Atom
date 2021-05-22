const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('./time.txt'),
  crlfDelay: Infinity
});

var time = 0;

rl.on('line', (line) => {
  time += parseInt(line.slice(0,-2));
  console.log(time);
});

