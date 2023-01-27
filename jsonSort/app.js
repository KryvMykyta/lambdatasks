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
    let counter = [0,0]
    for (let link of res){
        try{
            if(checkLevel(await getInfo(link))) {
                counter[0]+=1
            }
            else {
                counter[1]+=1
            }
        }
        catch (err){
            console.log(link," is not accessable")
        }
    }
    
    console.log(counter)
}

main()