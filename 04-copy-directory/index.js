const path = require("path");
const fs = require("fs");

const currentDirectory = path.join(__dirname, "files");

const outputDirectory = path.join(__dirname, "files-copy");

fs.mkdir(outputDirectory, { recursive: true }, (error) => {
  if (error) {
    console.error("Oops! Error!", error.message);
  } else console.log(`Congratulations! You created directory "${path.basename(outputDirectory)}".`);
});
fs.readdir(currentDirectory, (err, files) => {
  if (err) {
    console.error("Error with reading current folder.", err.message());
  }
  files.forEach((file) => {
    const pathToSourceFile = path.join(currentDirectory, file);
    const pathToCopiedFile = path.join(outputDirectory, file);
    fs.copyFile(pathToSourceFile, pathToCopiedFile, fs.constants.COPYFILE_EXCL, (err) => {
      if (err) {
        console.log(`File "${file}" already exists.`);
      }
    });
  });
});
