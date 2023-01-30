import axios from 'axios'
import fs from 'fs'

const LISTS = "list.txt"
function getLinks(filename){
    let resData = fs.readFileSync(filename, 'utf8')
    return JSON.parse(resData)
}

async function getInfo(endp){
    let res = await axios.get(endp)
    return res.data
}

function checkLevel(data){
    if (data?.isDone !== undefined){
        let isD = data?.isDone
        return isD
    }
    else{
        let keys = Object.keys(data)
        for (let element of keys){
            if (typeof(data[element]) === typeof({})){
                let res = checkLevel(data[element])
                if (res !== undefined){
                    return res
                }
                
            }
        }
    }
}


async function main(){
    let res = getLinks(LISTS)
    let data = await Promise.all(res.map(async (link) => {
        return getInfo(link)
    }))
    let counter = {
        "true": 0,
        "false": 0
    }
    for (let el of data){
        try{
            if(checkLevel(el)) {
                counter["true"]+=1
            }
            else {
                counter["false"]+=1
            }
        }
        catch (err){
            console.log(el," is not accessable")
        }
    }
    
    console.log(counter)
}

main()