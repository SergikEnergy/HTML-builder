const path = require("path");
const fs = require("fs");
const { stdin, stdout } = process;
const writeStream = fs.createWriteStream(path.join(__dirname, "result.txt"));
stdout.write(`Hello, guest! Please, type something in console.\nIf you want exit, type 'exit' or press 'Ctrl+C'\n`);
let result = "";
stdin.on("error", () => console.error("Error"));
stdin.on("data", (chunk) => {
  result += chunk.toString();
  if (result.match("exit") && result.trim().length === 4) {
    // console.log(chunk.toString().trim().length, chunk.toString(), chunk);
    process.exit();
  } else if (result.trim().length >= 1) {
    writeStream.write(result);
    result = "";
    stdout.write(`Type something else.\nor type 'exit'/press 'Ctrl+C' to exit\n`);
  } else {
    result = "";
    console.error("You didn't type anything, repeat typing, please");
  }
});
process.on("exit", () => {
  stdout.write("Thanks. Input was stopped.\n");
});
