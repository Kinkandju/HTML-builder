const { readdir, stat } = require('fs/promises');
const { extname } = require('path');

const folderPath = './03-files-in-folder/secret-folder';

async function readFolder() {
  try {
    const ONE_KILOBYTE = 1024;
    const DECIMAL_PLACES = 3;

    /* the list of objects of the Dirent type, each object
    represents a file or folder inside a secret-folder */
    const files = await readdir(folderPath, { withFileTypes: true });
  
    for (const file of files) {
      /* check is file or not */
      if (file.isFile()) {
        /* getting information about the file */
        const filePath = folderPath + '/' + file.name;
        const fileStat = await stat(filePath);

        /* getting the file size */
        const fileSizeBytes = fileStat.size;

        /* convert the file size to kilobytes with an accuracy of three decimal places */
        const fileSizeKBytes = (fileSizeBytes / ONE_KILOBYTE).toFixed(DECIMAL_PLACES);

        /* deleting a file extension */
        const fileName = file.name.slice(0, file.name.lastIndexOf('.'));

        /* deleting a file name */
        const fileExtension = extname(file.name).slice(1);
  
        console.log(`${fileName} - ${fileExtension} - ${fileSizeKBytes}kb`);
      } else {
        /* if the found object is not a file, skip it */
        continue;
      }
    }
  } catch (error) {
    console.error('Error reading the folder:', error);
  }
}
  
readFolder();
