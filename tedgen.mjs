export default class TEDGen {
    static END = "@END@";
    static START = "@START@";
    nGrams = [];

    buildNGrams(url, n=2, callback=null) {
        Papa.parse(url, {
            download: true,
            header: true,
            worker: false,
            step: (results) => {
                let title = results.data.name ?? "";
                if (title.length < 1) {
                    return;
                }
                let titleClean = title.slice(title.indexOf(":") + 2);
                let words = titleClean.split(" ");
                words.splice(0, 0, TEDGen.START);
                words.push(TEDGen.END);
                for (let nn = n; nn >= 2; nn--) {
                    for (let i = 0; i <= words.length - nn; i++) {
                        this.nGrams.push(words.slice(i, i+nn));
                    }
                }
            },
            complete: callback,
        });
    }

    generate() {
        let words = [TEDGen.START];
        while (words.at(-1) != TEDGen.END) {
            let possibilities = this.nGrams.filter((nGram) => nGram[0] == words[words.length - 1]);
            let nGram = possibilities[Math.floor(Math.random() * possibilities.length)];
            words.push(...nGram.slice(1));
        }
        return words.slice(1, -1).join(" ");
    }
}
