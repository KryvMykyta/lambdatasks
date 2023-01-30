import fs from 'fs';

function union(setA, setB) {
    var _union = new Set(setA);
    for (var elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function uniqueWords(fileName, alreadyExist) {
    let words = fs.readFileSync(fileName, { encoding: 'utf-8' }).split("\n");
    let unique = new Set(words);
    return union(alreadyExist, unique);
}

function amountOfWords(fileName, wordsCount) {
    let words = fs.readFileSync(fileName, { encoding: 'utf-8' }).split("\n");
    let unique = new Set(words);
    for (let item of unique) {
        if (wordsCount.get(item) != undefined) {
            wordsCount.set(item, wordsCount.get(item) + 1);
        }
        else {
            wordsCount.set(item, 1);
        }
    };
    return wordsCount;
}

function appearsIn20Files(wordsCount) {
    let count = 0;
    for (const [key, value] of wordsCount) {
        if (value === 20) {
            count++;
        }
    }
    return count;
}

function appearsIn10plusFiles(wordsCount) {
    let count = 0;
    for (const [key, value] of wordsCount) {
        if (value >= 10) {
            count++;
        }
    }
    return count;
}

function result(num) {
    console.log("num = ",num);
    console.time("total time : ")
    let words = new Set();
    let wordsCounter = new Map();
    for (let i = 0; i < 20; i++) {
        words = uniqueWords(`./files${num}/out${i}.txt`,words);
        wordsCounter = amountOfWords(`./files${num}/out${i}.txt`, wordsCounter);
    }

    console.time("unique time :")
    console.log("unique words : " + words.size);
    console.timeEnd("unique time :")

    console.time("twenty - unique time :")
    let inTwenty =  appearsIn20Files(wordsCounter);
    console.timeEnd("twenty - unique time :")
    console.log("in twenty files : " + inTwenty);
    

    console.time("more ten time:")
    let inMoreTen = appearsIn10plusFiles(wordsCounter);
    console.timeEnd("more ten time:")
    console.log("more ten : " + inMoreTen);

    console.timeEnd("total time : ");
}

function main() {
    result("");
    result("1");
}

main();