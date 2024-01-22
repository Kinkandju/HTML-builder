const { readdir, readFile, writeFile } = require('fs/promises');
const { join } = require('path');

async function mergeStyles() {
  const stylesDir = './05-merge-styles/styles';
  const bundleFile = './05-merge-styles/project-dist/bundle.css';

  try {
    /* read the contents of the styles folder */
    const files = await readdir(stylesDir);

    /* create an array to store the contents of all style files */
    const stylesArray = [];

    /* read each style file in the styles folder */
    for (const file of files) {
      const filePath = join(stylesDir, file);

      /* check if the style file has the .css extension */
      if (file.endsWith('.css')) {
        /* read the contents of the file */
        const fileData = await readFile(filePath, 'utf8');

        /* add the contents to the array */
        stylesArray.push(fileData);
      }
    }

    /* combine all styles into one large line separated by a line break */
    const combinedStyles = stylesArray.join('\n');

    /* write the combined styles to the bundle.css file */
    await writeFile(bundleFile, combinedStyles, 'utf8');

    console.log('The style file has been successfully merged!');
  } catch (error) {
    console.error('Error when merging style files:', error);
  }
}

mergeStyles();
