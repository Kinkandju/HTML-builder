const { mkdir, readdir, readFile, writeFile, copyFile, stat } = require('fs/promises');
const { join } = require('path');

async function buildPage() {
  const componentsDir = './06-build-page/components';
  const templateFile = './06-build-page/template.html';
  const distDir = './06-build-page/project-dist';

  try {
    /* create the project-dist folder, if it does not already exist */
    await mkdir(distDir, { recursive: true });

    /* read the contents of the template */
    const templateContent = await readFile(templateFile, 'utf8');

    /* get all the tags in the template */
    const tags = findTags(templateContent);

    /* replace tags with component contents */
    const pageContent = await replaceTags(templateContent, tags, componentsDir);

    /* write the modified template to a file index.html to the project-dist folder */
    await writeFile(join(distDir, 'index.html'), pageContent, 'utf8');

    console.log('The page has been successfully builded!');
  } catch (error) {
    console.error('Error when building the page:', error);
  }
}

function findTags(templateContent) {
  /* create a regular expression to search for tags in the template */
  const regex = /\{\{([^{}]+)\}\}/g;

  /* look for all tags in the template */
  const tags = templateContent.match(regex);

  /* if tags are found -> return a formatted array of tags,
  otherwise -> return an empty array */
  return tags ? tags.map(tag => tag.slice(2, -2).trim()) : [];
  /* - tag.slice(2, -2) cuts the first two and last two characters in each element.
  The tags have the format {{ tag }}, so remove the curly braces.
  - trim() removes spaces at the edges of the string to get a clean tag value. */
}

async function replaceTags(templateContent, tags, componentsDir) {
  /* create a variable to store the modified page content */
  let pageContent = templateContent;

  /* iterate on each tag */
  for (const tag of tags) {
    /* form the path to the component file */
    const componentFile = join(componentsDir, `${tag}.html`);

    try {
      /* read the contents of the component */
      const componentContent = await readFile(componentFile, 'utf8');

      /* replace the tag in the page content with the content of the component */
      pageContent = pageContent.replace(new RegExp(`{{\\s*${tag}\\s*}}`, 'g'), componentContent);
    } catch (error) {
      console.error(`Error reading the component ${componentFile}:`, error);
    }
  }
    return pageContent;
}

buildPage();

async function copyAssets() {
  const assetsDir = './06-build-page/assets';
  const distDir = './06-build-page/project-dist';

  try {
    await copyFolder(assetsDir, join(distDir, 'assets'));
    console.log('The assets folder has been successfully copied!');
  } catch (error) {
    console.error('Error copying assets folder:', error);
  }
}

async function copyFolder(source, destination) {
  try {
    await mkdir(destination, { recursive: true });
    const files = await readdir(source);

    for (const file of files) {
      const sourcePath = join(source, file);
      const destinationPath = join(destination, file);
      const fileStat = await stat(sourcePath);

      if (fileStat.isDirectory()) {
        await copyFolder(sourcePath, destinationPath);
      } else {
        await copyFile(sourcePath, destinationPath);
      }
    }
  } catch (error) {
    throw error;
  }
}

copyAssets();

async function addStyles() {
  const stylesDir = './06-build-page/styles';
  const bundleFile = './06-build-page/project-dist/style.css';

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

    console.log('The style file has been successfully merged and added!');
  } catch (error) {
    console.error('Error when merging style files:', error);
  }
}

addStyles();
