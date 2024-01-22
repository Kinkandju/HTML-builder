const fs = require('fs');
const readLine = require('readline');

/* determine the path to the file in which we will record user input */
const filePath = './02-write-file/text.txt';

/* create a stream to write to a file */
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

/* display a greeting and instructions */
console.log('Hi, folks!! If you want, you can enter some text (or type "exit" to quit):');

/* create an interface for reading user input from standard input and writing to standard output */
const createInterfaceReadLine = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* an event for processing each entered line */
createInterfaceReadLine.on('line', (input) => {
  /* if the user has entered "exit" -> terminate the program */
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Bye, folks!');

    /* close the recording stream */
    writeStream.close();

    /* complete the process */
    process.exit();
  } else {
    /* write the entered line to a file with a line feed */
    writeStream.write(input + '\n');
  }
});
