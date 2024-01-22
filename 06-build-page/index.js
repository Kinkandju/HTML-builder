const { mkdir, readdir, readFile, writeFile, copyFile, stat } = require('fs/promises');
const { join } = require('path');

async function buildPage() {
  const componentsDir = './06-build-page/components';
  const templateFile = './06-build-page/template.html';
  const distDir = './06-build-page/project-dist';

  try {
    await mkdir(distDir, { recursive: true });

    const templateContent = await readFile(templateFile, 'utf8');
    const tags = findTags(templateContent);
    const pageContent = await replaceTags(templateContent, tags, componentsDir);

    await writeFile(join(distDir, 'index.html'), pageContent, 'utf8');

    console.log('The page has been successfully builded!');
  } catch (error) {
    console.error('Error when building the page:', error);
  }
}

function findTags(templateContent) {
  const regex = /\{\{([^{}]+)\}\}/g;
  const tags = templateContent.match(regex);
  return tags ? tags.map(tag => tag.slice(2, -2).trim()) : [];
}

async function replaceTags(templateContent, tags, componentsDir) {
  let pageContent = templateContent;

  for (const tag of tags) {
    const componentFile = join(componentsDir, `${tag}.html`);

    try {
      const componentContent = await readFile(componentFile, 'utf8');
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
