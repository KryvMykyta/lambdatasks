import fs from "fs";

const union = (setA, setB) => {
  var _union = new Set(setA);
  for (var elem of setB) {
    _union.add(elem);
  }
  return _union;
}

const uniqueWords = (fileName, alreadyExistInFiles) => {
  const words = fs.readFileSync(fileName, { encoding: "utf-8" }).split("\n");
  const uniqueFromFile = new Set(words);
  return union(alreadyExistInFiles, uniqueFromFile);
}

const amountOfWords = (fileName, wordsCount) => {
  const words = fs.readFileSync(fileName, { encoding: "utf-8" }).split("\n");
  const uniqueWords = new Set(words);
  Array.from(uniqueWords).map((word) => {
    if (wordsCount.get(word)) {
      wordsCount.set(word, wordsCount.get(word) + 1);
    } else {
      wordsCount.set(word, 1);
    }
  });
  return wordsCount;
}

const appearsIn20Files = (wordsCount) => {
  let count = 0;
  for (const [key, value] of wordsCount) {
    if (value === 20) {
      count++;
    }
  }
  return count;
}

const appearsIn10plusFiles = (wordsCount) => {
  let count = 0;
  for (const [key, value] of wordsCount) {
    if (value >= 10) {
      count++;
    }
  }
  return count;
}

const main = () => {
  console.time("Total time : ");
  let words = new Set();
  let wordsCounter = new Map();
  for (let i = 0; i < 20; i++) {
    words = uniqueWords(`./files1/out${i}.txt`, words);
    wordsCounter = amountOfWords(`./files1/out${i}.txt`, wordsCounter);
  }

  console.time("Time to get unique words :");
  console.log("Unique words : " + words.size);
  console.timeEnd("Time to get unique words :");

  console.time("Time to get words that appears in 20 files:");
  const inTwenty = appearsIn20Files(wordsCounter);
  console.timeEnd("Time to get words that appears in 20 files:");
  console.log("Quantity of words that appears in 20 files:" + inTwenty);

  console.time("Time to get words that appears in more than 10 files:");
  const inMoreTen = appearsIn10plusFiles(wordsCounter);
  console.timeEnd("Time to get words that appears in more than 10 files:");
  console.log(
    "Quantity of words that appears in more than 10 files : " + inMoreTen
  );

  console.timeEnd("Total time : ");
}

main();
