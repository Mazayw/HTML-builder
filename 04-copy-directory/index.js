const fs = require('fs');
const path = require('path');

const copyFrom = path.resolve(__dirname, 'files');
const copyTo = path.resolve(__dirname, 'files-copy');

fs.mkdir(copyTo, { recursive: true }, (err) => {
  if (err) return console.log('Can`t create folder. Error code: ', err.code);
});

fs.readdir(copyFrom, { withFileTypes: true }, (error, data) => {
  if (error) throw error.code;

  data.forEach((file) => {
    if (file.isFile()) {
      const copyFromFilePath = path.resolve(copyFrom, file.name);
      const copyToFilePath = path.resolve(copyTo, file.name);

      fs.copyFile(copyFromFilePath, copyToFilePath, (error) => {
        if (error) throw error.code;
        console.log(`${file.name} copied`);
      });
    }
  });
});
