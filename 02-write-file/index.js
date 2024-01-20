const fs = require('fs');
const readLine = require('readline');

const filePath = './02-write-file/text.txt';
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Hi, folks!! If you want, you can enter some text (or type "exit" to quit):');

const createInterfaceReadLine = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

createInterfaceReadLine.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Bye, folks!');
    writeStream.close();
    process.exit();
  } else {
    writeStream.write(input + '\n');
  }
});