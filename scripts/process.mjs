// node .\scripts\process.mjs
import fs from "fs";
import Papa from "papaparse";

process.chdir("./scripts");
const fileMain = fs.readFileSync("../data/ted_main.csv", "utf8");
const fileTranscripts = fs.readFileSync("../data/transcripts.csv", "utf8");
const data = [];

let rowsMain, rowsTranscripts;

Papa.parse(fileMain, {
    header: true,
    worker: false,
    complete: results => {
        rowsMain = results.data;
    }
});

Papa.parse(fileTranscripts, {
    header: true,
    worker: false,
    complete: results => {
        rowsTranscripts = results.data;
    }
});

const nRows = Math.min(rowsMain.length, rowsTranscripts.length);

for (let i = 0; i < nRows; i++) {
    const title = rowsMain[i].name ?? "";
    const transcript = rowsTranscripts[i].transcript ?? "";
    if (title.length < 1 || transcript.length < 1) {
        continue;
    }

    const titleClean = title.slice(title.indexOf(":") + 2);
    const titleWords = titleClean.split(" ");

    const cleanTranscript = transcript
        .replace(".", ". <br> ")
        .replace("!", "! <br> ")
        .replace("?", "? <br> ");

    const transcriptWords = cleanTranscript.split(" ");

    data.push({
        titleWords,
        transcriptWords,
    });
}

fs.writeFileSync("../data.json", JSON.stringify(data));