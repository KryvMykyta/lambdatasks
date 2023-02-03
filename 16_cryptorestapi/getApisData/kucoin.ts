import axios from 'axios'
import { resolve } from 'path';
require('dotenv').config()

const URL = "https://api.kucoin.com/api/v1/prices"
export async function getKucoin() : Promise<{[key: string]: number}> {
    const response = await axios.get(URL);

    const {data} = response.data
    
    let keys = Object.keys(data)
    let resObj : {[key: string]: number} = {}
    for (let el of keys){
        resObj[el] = Number(data[el])
    }
    return resObj
}
