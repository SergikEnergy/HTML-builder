const fs = require("fs");
const path = require("path");

const urlToFolder = path.join(__dirname, "secret-folder");
fs.readdir(urlToFolder, { withFileTypes: false }, (err, elements) => {
  if (err) console.error("Oops! Error!", err.message);
  else {
    elements.forEach((data) => {
      const pathToFile = path.join(urlToFolder, data);
      fs.stat(pathToFile, (err, stats) => {
        if (err) console.error("Oops! Error!", err.message);
        if (stats.isFile()) {
          const fileObj = path.parse(data);
          const extFile = path.extname(pathToFile).replace(".", "");
          console.log(`${fileObj.name} - ${extFile} - ${stats.size / 1000} kB`);
        }
      });
    });
  }
});
