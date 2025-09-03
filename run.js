import fs from "fs";

const data = JSON.parse(fs.readFileSync("./meny.json", "utf-8"));
console.log(data);