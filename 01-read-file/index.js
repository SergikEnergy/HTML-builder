const fs = require("fs");
const path = require("path");
const streamRead = fs.createReadStream(path.resolve(__dirname, "text.txt"), "utf-8");

let data = "";

streamRead.on("data", (chunk) => (data += chunk));
streamRead.on("end", () => console.log(`${data}`));
streamRead.on("error", (error) => console.error("Error", error.message));
