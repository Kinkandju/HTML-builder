const { readdir, readFile, writeFile } = require('fs/promises');
const { join } = require('path');

async function mergeStyles() {
  const stylesDir = './05-merge-styles/styles';
  const bundleFile = './05-merge-styles/project-dist/bundle.css';

  try {
    const files = await readdir(stylesDir);

    const stylesArray = [];

    for (const file of files) {
      const filePath = join(stylesDir, file);

      if (file.endsWith('.css')) {
        const fileData = await readFile(filePath, 'utf8');

        stylesArray.push(fileData);
      }
    }

    const combinedStyles = stylesArray.join('\n');

    await writeFile(bundleFile, combinedStyles, 'utf8');

    console.log('The style file has been successfully merged!');
  } catch (error) {
    console.error('Error when merging style files:', error);
  }
}

mergeStyles();
  