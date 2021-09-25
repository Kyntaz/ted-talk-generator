export default class TEDGen {
    static END = "@END@";
    static START = "@START@";
    nGrams = [];

    buildNGrams(url, n=2, callback=null) {
        fetch(url)
        .then(response => response.json())
        .then(titles => {
            for (let words of titles) {
                words.splice(0, 0, TEDGen.START);
                words.push(TEDGen.END);
                for (let m = n; m >= 2; m--) {
                    for (let i = 0; i <= words.length - m; i++) {
                        this.nGrams.push(words.slice(i, i+m));
                    }
                }
            }
            callback();
        });
    }

    generate() {
        let words = [TEDGen.START];
        while (words.at(-1) != TEDGen.END) {
            let possibilities = this.nGrams.filter((nGram) => nGram[0] == words.at(-1));
            let nGram = possibilities[Math.floor(Math.random() * possibilities.length)];
            words.push(...nGram.slice(1));
        }
        return words.slice(1, -1).join(" ");
    }
}
