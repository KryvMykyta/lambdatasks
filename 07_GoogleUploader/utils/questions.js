import inquirer from "inquirer";
import dotenv from 'dotenv'
dotenv.config()

export const askPath = async () => {
    const {path} = await inquirer.prompt([
        {
            name: "path",
            type: "input",
            message: "path"
        }
    ])
    return path.replaceAll("'","")
}

const askChangeFileName = async () => {
    const {confirm} = await inquirer.prompt(
        [{
            name:"confirm",
            type:"list",
            message:"changename",
            choices: ["yes","no"]
        }]
    )
    return confirm
}


const askNewFileName = async () => {
    const {newName} = await inquirer.prompt(
        [{
            name: "newName",
            type: "input",
            message: "newname? "
        }]
    )
    return newName
}

const getName = (str) => {
    return str.split('\\').pop().split('/').pop();
}


export const newFileName = async (path) => {
    const fileName = getName(path)
    const confirmChangingFileName = await askChangeFileName()
    if (confirmChangingFileName === "yes"){
        return await askNewFileName()
    }
    return fileName
}

export const confirmShortLink = async () => {
    const {confirm} = await inquirer.prompt(
        [{
            name:"confirm",
            type:"list",
            message:"short link?",
            choices: ["yes","no"]
        }]
    )
    return confirm
}