// This script should run locally with node.js
import fs from "fs";
import Papa from "../papaparse.min.js";

process.chdir("./scripts");
const file = fs.readFileSync("../ted_main.csv").toString();
const titles = [];

Papa.parse(file, {
    header: true,
    worker: false,
    step: (results) => {
        let title = results.data.name ?? "";
        if (title.length < 1) {
            return;
        }
        let titleClean = title.slice(title.indexOf(":") + 2);
        let words = titleClean.split(" ");
        titles.push(words);
    }
});

fs.writeFileSync("../titles.json", JSON.stringify(titles));