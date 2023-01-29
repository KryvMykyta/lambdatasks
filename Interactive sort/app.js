const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getNumbers(arr){
    let resArr = arr.filter(str => !isNaN(str))
    return resArr
}

function getWords(arr){
    let resArr = arr.filter(str => isNaN(str))
    return resArr
}

function Repeat() {
    rl.question('Enter words: ', function (words) {
        let arr = words.split(" ");
        let checker = true;
        console.log(arr);
        function Action() {
            rl.question("what do you want to do?\n"+ 
            "1) Alphabetical sort\n"+
            "2) Sort digits from the smallest to the biggest\n"+
            "3) Sort digits from the biggest to the smallest\n"+
            "4) Sort words by quantity of letters\n"+
            "5) Show only unique words\n"+
            "6) Show unique words and numbers\n"+
            "or 'exit' to execute the programm\n", function (func) {
                switch (func) {
                    case "exit":
                        process.exit(0);
                        break;
                    case "1":
                        console.log(getWords(arr).sort())
                        Action();
                        break
                    case "2":
                        let increasing = getNumbers(arr)
                        increasing.sort((a,b) => a - b)
                        console.log(increasing)
                        Action();
                        break;
                    case "3":
                        let decreasing = getNumbers(arr)
                        decreasing.sort((a,b) => b-a)
                        console.log(decreasing)
                        Action();
                        break;
                    case "4":
                        console.log(getWords(arr).sort((a,b) => a.length - b.length))
                        Action();
                        break
                    case "5":
                        console.log(Array.from(new Set(getWords(arr))))
                        Action();
                        break
                    case "6":
                        let unique = Array.from(new Set(arr))
                        console.log(unique)
                        Action();
                        break
                    default:
                        console.log("Choose 1-6 or exit");
                        Action();
                        break;
                }
            });
        }
        Action();
    });
}
Repeat();