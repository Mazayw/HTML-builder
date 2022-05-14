const fs = require('fs');
const path = require('path');

const styles = path.resolve(__dirname, 'styles');
const dist = path.resolve(__dirname, 'project-dist', 'bundle.css');

fs.readdir(styles, { withFileTypes: true }, (error, data) => {
  if (error) throw error;
  fs.createWriteStream(dist);

  data.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const cssFile = fs.createReadStream(
        path.resolve(styles, file.name),
        'utf8'
      );
      cssFile.on('data', (chunk) => {
        fs.appendFile(dist, chunk, (error) => {
          if (error) throw error;
        });
      });
      console.log(`Processing ${file.name}`);
    }
  });
  console.log('File "bundle.css" generated');
});
