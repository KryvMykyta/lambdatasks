import axios from 'axios'
require('dotenv').config()

const URL = "https://api.coinstats.app/public/v1/coins?skip=0&limit=500"
export async function getCoinStats() : Promise<{[key: string]: number}>  {
    const response = await axios.get(URL);

    const {data} = response

    const {coins} = data

    let resObj : {[key: string]: number} = {}

    for(let listing of coins){
        resObj[listing["symbol"].toString()] = listing["price"]
    }

    return resObj
}
