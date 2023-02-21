import inquirer from "inquirer"
import fs from 'fs'

const DBNAME = "db.txt"

const getPeople = (filename)=> {
    try{
        const people = fs.readFileSync(filename, 'utf8');
        return JSON.parse(people)
    } catch(err) {
        return []
    }
}

const putPeople =(filename, people)=> {
    fs.writeFileSync(filename, JSON.stringify(people), 'utf8')
}

const addHumanToDB =(human, filename) => {
    let data = getPeople(filename)
    data.push(human)
    putPeople(DBNAME, data)
}

const findPeople = (subName) => {
    const people = getPeople(DBNAME)
    subName = subName.toLowerCase()
    let foundPeople = [];
    people.forEach(human => {
        const humanName = human.name.toLowerCase();
        if (humanName.startsWith(subName)) {
            foundPeople.push(human)
        }
    });
    return foundPeople
}

const addHumanQuestion = async () => {
    const {name} = await inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: "name"
            }
        ])
    
    console.log(!name)

    if (name) {
        const { age, gender } = await inquirer.prompt([
            {
                name: "age",
                type: "input",
                message: "Age"
            },

            {
                name: "gender",
                type: "list",
                message: "Choose your fighter: ",
                choices: ["male", "female", "Tyubik"]
            }
        ])
        const human = {
            name: name,
            age: age,
            gender: gender
        }
        addHumanToDB(human, DBNAME)
        addHumanQuestion();
    } else {
        const {checkDB} = await inquirer.prompt([
            {
                name: "checkDB",
                type: "list",
                choices: ["Yes", "No"],
                message: "Would you check DB?"
            }
        ])
        if(checkDB === "Yes"){
            console.log(getPeople(DBNAME))
            const {requiredName} = await inquirer.prompt([
                {
                    name: "requiredName",
                    type: "input",
                    message: "Who you want to find?"
                }
            ])
            console.log(findPeople(requiredName))
        }
        else {
            process.exit(0);
        }
    }
}

addHumanQuestion();
