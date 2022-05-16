const fs = require('fs');
const path = require('path');

const assetsDirectory = path.resolve(__dirname, 'assets');
const components = path.resolve(__dirname, 'components');
const dist = path.resolve(__dirname, 'project-dist');
const stylesDirectory = path.resolve(__dirname, 'styles');
const stylesDist = path.resolve(dist, 'style.css');
const templateHtml = path.resolve(__dirname, 'template.html');
const destHtml = path.resolve(dist, 'index.html');

// Copy directory
async function copyDir(src, dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });
  } catch (error) {
    console.error('Can`t create folder. Error code: ', error.code);
    return;
  }

  try {
    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
        console.log(`Directory ${entry.name} copied`);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('Can`t read source folder. Error code: ', error);
  }
}

//Merge styles
async function mergeStyles(source, destFile) {
  try {
    await fs.promises.mkdir(dist, { recursive: true });
    fs.createWriteStream(destFile);
    const entries = await fs.promises.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && path.extname(entry.name) === '.css') {
        const fileData = await fs.promises.readFile(
          path.resolve(source, entry.name),
          {
            encoding: 'utf8',
          }
        );
        fs.promises.appendFile(destFile, fileData + '\n\n');
      }
      console.log(`CSS file ${entry.name} merged`);
    }
  } catch (error) {
    console.error('Can`t merge styles. Error code: ', error);
    return;
  }
}

//HTML generator
async function htmlGenerator(source, destFile) {
  try {
    await fs.promises.mkdir(dist, { recursive: true });
    const destinationFile = fs.createWriteStream(destFile);
    let sourceHtml = await fs.promises.readFile(templateHtml, {
      encoding: 'utf8',
    });
    const entries = await fs.promises.readdir(source, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && path.extname(entry.name) === '.html') {
        const tagName = `{{${path.basename(
          entry.name,
          path.extname(entry.name)
        )}}}`;
        const filePath = path.resolve(source, entry.name);
        const fileData = await fs.promises.readFile(filePath, {
          encoding: 'utf8',
        });
        sourceHtml = sourceHtml.replace(tagName, fileData);
      }
    }
    destinationFile.write(sourceHtml);
    console.log('index.html created');
  } catch (error) {
    console.error('Can`t create HTML file. Error code: ', error);
    return;
  }
}

copyDir(assetsDirectory, path.resolve(__dirname, 'project-dist', 'assets'));
mergeStyles(stylesDirectory, stylesDist);
htmlGenerator(components, destHtml);
