const path = require("path");
const fs = require("fs");
const { constants } = require("fs");
const { pipeline } = require("stream");

const directoryName = path.join(__dirname, "project-dist");
const pathToTemplateHtml = path.join(__dirname, "template.html");
const componentsDir = path.join(__dirname, "components");

// createDirectory(directoryName);
function createDirectory(pathToDirectory) {
  fs.mkdir(pathToDirectory, { recursive: true }, (error) => {
    if (error) {
      console.error("Oops! Error!", error.message);
    }
  });
}
//copy assets in project-dist

let copyDirectory = (source, destination) => {
  fs.readdir(source, (err, files) => {
    if (err) {
      console.error("Error with reading current folder.", err.message());
    }
    files.forEach((file) => {
      const pathToSourceFile = path.join(source, file);
      const pathToOutputFile = path.join(destination, file);
      fs.stat(pathToSourceFile, (err, item) => {
        if (err) console.error("Oops! Error!", err.message);
        if (item.isDirectory()) {
          createDirectory(pathToOutputFile);
          copyDirectory(pathToSourceFile, pathToOutputFile);
        } else {
          fs.copyFile(pathToSourceFile, pathToOutputFile, constants.COPYFILE_FICLONE, (error) => {
            if (error) console.log(`Error with writing`);
          });
        }
      });
    });
  });
};
const assetsSource = path.join(__dirname, "assets");
const assetsCopied = path.join(directoryName, "assets");
copyDirectory(assetsSource, assetsCopied);

//build html file
const indexHtmlPath = path.join(directoryName, "index.html");
fs.copyFile(pathToTemplateHtml, indexHtmlPath, (err) => {
  if (err) {
    console.error(err.message);
  }
});
//read components
let componentsList = [];
fs.readdir(componentsDir, (err, files) => {
  if (err) {
    console.error("Error with reading current folder.", err.message());
  }
  files.forEach((file) => {
    const pathToFileComponent = path.join(componentsDir, file);
    fs.stat(pathToFileComponent, (err, item) => {
      if (err) console.error("Oops! Error!", err.message);
      if (item.isFile() && path.extname(pathToFileComponent) === ".html") {
        componentsList.push(path.basename(pathToFileComponent).replace(".html", ""));
      }
    });
  });
});
console.log(componentsList);

//bundle styles.css
const stylesPath = path.join(__dirname, "styles");
const bundleFilePath = path.join(__dirname, "project-dist", "style.css");
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
