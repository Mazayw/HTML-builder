const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');

const dirPath = path.resolve(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(dirPath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

writeStream.on('error', (error) => {
  console.log('Exiting with error code: ', error.code);
  process.exit();
});

rl.write('Write some text: \n');
rl.on('line', function (input) {
  if (input.toLowerCase() === 'exit') {
    rl.close();
  } else {
    writeStream.write(`${input}\n`);
    console.log(`Text "${input}" added to file`);
  }

  rl.on('close', () => {
    console.log('Bye!');
    process.exit();
  });
});
