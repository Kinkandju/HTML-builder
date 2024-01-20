const { readdir, stat } = require('fs/promises');
const { extname } = require('path');

const folderPath = './03-files-in-folder/secret-folder';

async function readFolder() {
  try {
    const ONE_KILOBYTE = 1024;
    const DECIMAL_PLACES = 3;
    const files = await readdir(folderPath, { withFileTypes: true });
  
    for (const file of files) {
      if (file.isFile()) {
        const filePath = folderPath + '/' + file.name;
        const fileStat = await stat(filePath);
        const fileSizeBytes = fileStat.size;
        const fileSizeKBytes = (fileSizeBytes / ONE_KILOBYTE).toFixed(DECIMAL_PLACES);
        const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
        const fileExtension = extname(file.name).slice(1);
  
        console.log(`${fileName} - ${fileExtension} - ${fileSizeKBytes}kb`);
      } else {
        continue;
      }
    }
  } catch (error) {
    console.error('Error reading the folder:', error);
  }
}
  
readFolder();