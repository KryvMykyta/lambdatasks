import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question =
  "what do you want to do?\n" +
  "1) Alphabetical sort\n" +
  "2) Sort digits from the smallest to the biggest\n" +
  "3) Sort digits from the biggest to the smallest\n" +
  "4) Sort words by quantity of letters\n" +
  "5) Show only unique words\n" +
  "6) Show unique words and numbers\n" +
  "or 'exit' to execute the programm\n";

const getNumbers = (arr) => {
  const resArr = arr.filter((str) => !isNaN(str));
  return resArr;
};

const getWords = (arr) => {
  const resArr = arr.filter((str) => isNaN(str));
  return resArr;
};

const inputWords = () => {
  rl.question("Enter words: ", (words) => {
    const wordsArray = words.split(" ");
    console.log(wordsArray);
    function askMethod() {
      rl.question(question, (func) => {
        switch (func) {
          case "exit":
            process.exit(0);
          case "1":
            console.log(getWords(wordsArray).sort());
            askMethod();
            break;
          case "2":
            const increasing = getNumbers(wordsArray).sort((a, b) => a - b);
            console.log(increasing);
            askMethod();
            break;
          case "3":
            const decreasing = getNumbers(wordsArray).sort((a, b) => b - a);
            console.log(decreasing);
            askMethod();
            break;
          case "4":
            console.log(getWords(wordsArray).sort((a, b) => a.length - b.length));
            askMethod();
            break;
          case "5":
            console.log(Array.from(new Set(getWords(wordsArray))));
            askMethod();
            break;
          case "6":
            console.log(Array.from(new Set(wordsArray)));
            askMethod();
            break;
          default:
            console.log("Choose 1-6 or exit");
            askMethod();
            break;
        }
      });
    }
    askMethod();
  });
};

inputWords();
