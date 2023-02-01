import inquirer from "inquirer"
import fs from 'fs'

const DBNAME = "db.txt"
function getPeople(filename){
    const resData = fs.readFileSync(filename, 'utf8');
    return JSON.parse(resData)
}

function loadPeople(filename, content){
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8')
}

function addHuman(human, filename){

    let data = getPeople(filename)
    data.push(human)
    loadPeople(DBNAME, data)
}


function Add() {
    inquirer
        .prompt([{
            name: "Name",
            type: "input",
            message: "name"
        }
        ])
        .then(function (answer) {
            if (answer.Name != "") {
                inquirer
                .prompt([
                    {
                        name: "Age",
                        type: "input",
                        message: "Age"
                    },

                    {
                        name: "Gender",
                        type: "list",
                        message: "Choose your fighter: ",
                        choices: ["male", "female", "Tyubik"]
                    }
                ])
                .then(function (answers) {
                    let human = Object.assign(answer, answers)
                    addHuman(human, DBNAME)
                    Add();
                })
            }
            else {
                inquirer
                .prompt([
                    {
                        name: "ProgrammFate",
                        type: "list",
                        choices: ["Yes", "No"],
                        message: "Would you check DB?"
                    }
                ])
                .then(function (question) {
                    if (question.ProgrammFate == "Yes") {
                        console.log(getPeople(DBNAME))
                        inquirer
                        .prompt([
                        {
                            name: "FoundName",
                            type: "input",
                            message: "Who you want to find?"
                        }
                        ])
                        .then(async function (req) {
                            let data = getPeople(DBNAME)
                            let found = req.FoundName
                            found = found.toLowerCase()
                            let resArr = [];
                            data.forEach(element => {
                                let elName = element.Name;
                                elName = elName.toLowerCase()
                                if(elName.startsWith(found)){
                                    resArr.push(element)
                                }
                            });
                            console.log(resArr)
                        })
                        }
                        else {
                            process.exit(0);
                        }
                })
            }
        });
}

Add();
