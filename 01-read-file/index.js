const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'text.txt');
const textFile = fs.createReadStream(dirPath, 'utf8');

textFile.on('data', function (chunk) {
  console.log(chunk);
});

textFile.on('error', function (err) {
  if (err.code == 'ENOENT') {
    console.log('File not found');
  } else {
    console.error(err);
  }
});
