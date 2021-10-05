export default class TEDGen {
    static END = "@END@";
    static START = "@START@";
    data;
    n = 2;
    nGrams = [];

    makeNGrams(wordList, n) {
        let nGrams = []
        for (let m = n; m >= 2; m--) {
            for (let i = 0; i <= wordList.length - m; i++) {
                nGrams.push(wordList.slice(i, i+m));
            }
        }
        return nGrams;
    }

    /**
     * @param url {string}
     * @param n {int}
     * @param callback {() => void}
     */
    buildNGrams(url, n=2, callback=null) {
        this.n = n;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            this.data = data;
            for (const document of data) {
                let words = document.titleWords;
                words.splice(0, 0, TEDGen.START);
                words.push(TEDGen.END);
                this.nGrams.push(...this.makeNGrams(words, n));
            }
            callback();
        });
    }

    generateTitle() {
        let words = [TEDGen.START];
        while (words.at(-1) != TEDGen.END) {
            let possibilities = this.nGrams.filter((nGram) => nGram[0] == words.at(-1));
            let nGram = possibilities[Math.floor(Math.random() * possibilities.length)];
            words.push(...nGram.slice(1));
        }
        return words.slice(1, -1).join(" ");
    }

    /**
     * @param title {string}
     * @returns {string}
     */
    generateTranscript(title) {
        const n = this.n;
        const nGrams = [["<br>", TEDGen.END]];
        const titleWords = title.split(" ");

        // Build n-grams
        let limitDocs = 3;
        for (const document of this.data) {
            const shouldInclude = titleWords
                .filter(el => document.titleWords.indexOf(el) > -1)
                .length > 1;
            if (shouldInclude && Math.random() < 0.5) {
                let words = document.transcriptWords;
                words.splice(0, 0, TEDGen.START);
                words.push(TEDGen.END);
                nGrams.push(...this.makeNGrams(words, 30));
                if (limitDocs-- < 0) break;
            }
        }

        // Generate
        console.log("Generating");
        const words = [TEDGen.START];
        let limitGen = 100;
        while (words.at(-1) != TEDGen.END) {
            let possibilities = nGrams.filter((nGram) => nGram[0] == words.at(-1));
            if (limitGen < 0) {
                const endingPossibilities = possibilities.filter(nGram => nGram.at(-1) == TEDGen.END);
                if (endingPossibilities.length > 0) possibilities = endingPossibilities;
            }
            const nGram = possibilities[Math.floor(Math.random() * possibilities.length)];
            words.push(...nGram.slice(1));
            limitGen--;
        }

        return words.slice(1, -1).join(" ");; 
    }
}
