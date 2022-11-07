const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");

const stylesPath = path.join(__dirname, "styles");
const bundleFilePath = path.join(__dirname, "project-dist", "bundle.css");
let isBuild = false;

fs.readdir(stylesPath, (error, contents) => {
  if (error) console.error("Oops, couldn't read the folder", error.message);
  contents.forEach((content) => {
    const fileStylesPath = path.join(stylesPath, content);
    fs.stat(fileStylesPath, (error, info) => {
      if (error) console.error(`Couldn't read the file ${path.basename(content)}`, error.message);
      if (info.isFile() && path.extname(content) === ".css") {
        readStream = fs.createReadStream(fileStylesPath, "utf-8");
        if (!isBuild) {
          writeStream = fs.createWriteStream(bundleFilePath, { flags: "w" });
          isBuild = true;
        } else if (isBuild) {
          writeStream = fs.createWriteStream(bundleFilePath, { flags: "a" });
        }
        pipeline(readStream, writeStream, (error) => {
          if (error) console.error("Error with connect streams", error.message);
        });
      }
    });
  });
});
