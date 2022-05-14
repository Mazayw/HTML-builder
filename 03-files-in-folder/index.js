const fs = require('fs');
const path = require('path');

const folderName = 'secret-folder';
const dirPath = path.resolve(__dirname, folderName);

fs.readdir(dirPath, { withFileTypes: true }, (error, data) => {
  if (error) return console.error('Error: ', error.code);

  data.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.resolve(dirPath, file.name);
      fs.stat(filePath, (error, stat) => {
        if (error) return console.error('Error: ', error.code);

        const ext = path.extname(file.name);
        const name = path.basename(file.name, ext);
        const size = `${(stat.size / 1024).toFixed(3)}kb`;

        console.log(`${name} - ${ext.slice(1)} - ${size}`);
      });
    }
  });
});
