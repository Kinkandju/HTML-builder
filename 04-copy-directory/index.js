const { mkdir, readdir, copyFile, stat, rm } = require('fs/promises');
const { join } = require('path');

(async function copyDir() {
  const sourceDir = './04-copy-directory/files';
  const destinationDir = './04-copy-directory/files-copy';

  try {
    /* check if the files-copy folder exists, and if not, then create it */
    const dirExists = await checkIfDirectoryExists(destinationDir);

    if (dirExists) {
      /* if the files-copy folder already exists, delete it recursively */
      await rm(destinationDir, { recursive: true });
    }
    /* create the files-copy folder */
    await mkdir(destinationDir, { recursive: true });

    /* read the contents of the files folder */
    const files = await readdir(sourceDir);

    /* copy each file from the files folder to the files-copy folder */
    for (const file of files) {
      const sourceFilePath = join(sourceDir, file);
      const destinationFilePath = join(destinationDir, file);

      await copyFile(sourceFilePath, destinationFilePath);
    }

    console.log('The folder has been copied successfully!');
  } catch (error) {
    console.error('Error copying folder:', error);
  }
})();

async function checkIfDirectoryExists(dirPath) {
  try {
    /* check if there is a folder in the specified path */
    const dirStats = await stat(dirPath);

    return dirStats.isDirectory();
  } catch (error) {
    /* ENOENT is short for "Error NO ENTry" (there is no such entry).
    This error occurs when you try to access a file or directory that does not exist. */
    if (error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}
