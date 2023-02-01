import inquirer from "inquirer";
import { uploadFile } from "./uploads.js";
import axios from "axios";
import crypto from 'crypto';
import dotenv from 'dotenv'
dotenv.config()


const FOLDER_ID = process.env.FOLDER_ID
const tinyUrlToken = process.env.TOKEN
var getName = function (str) {
    return str.split('\\').pop().split('/').pop();
}

async function main(){
    let res = await inquirer
    .prompt([
        {
            name: "path",
            type: "input",
            message: "path"
        }
    ])
    let changeName = await inquirer.prompt(
        [{
            name:"confirm",
            type:"list",
            message:"changename",
            choices: ["yes","no"]
        }]
    )
    let newName = ""
    if (changeName.confirm === "yes"){
        newName = await inquirer.prompt(
            [{
                name: "data",
                type: "input",
                message: "newname? "
            }]
        )
        newName = newName.data
    }
    let link = ""
    if (newName === ""){
        //upload with oldname
        link = await uploadFile(FOLDER_ID,getName(res.path),res.path)
    }
    else{

        link = await uploadFile(FOLDER_ID,newName,res.path)
        //upload with newName
    }

    let shortenLink = await inquirer.prompt(
        [{
            name:"confirm",
            type:"list",
            message:"short link?",
            choices: ["yes","no"]
        }]
    )
    link = "https://drive.google.com/uc?export=view&id="+link
    if (shortenLink.confirm === "yes"){
        let generated = crypto.randomBytes(10).toString('hex');
        console.log(generated)
        let newLink = await axios.post("https://api.tinyurl.com/create",{
            url: link,
            domain: "tiny.one",
            alias: generated,
            api_token: tinyUrlToken
        })
        console.log(newLink.data.data.tiny_url)
        //log shorted link
    }
    else {
        console.log(link)
        //log full link
    }
}

main()

