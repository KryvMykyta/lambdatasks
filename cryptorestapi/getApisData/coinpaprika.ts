import axios from 'axios'
import { resolve } from 'path';
require('dotenv').config()

const URL = "https://api.coinpaprika.com/v1/tickers"
export async function getPaprika() : Promise<{[key: string]: number}>  {
    const response = await axios.get(URL);

    const {data} = response

    let resObj : {[key: string]: number} = {
    }

    for (let listing of data){
        resObj[listing["symbol"].toString()] = listing["quotes"]["USD"]["price"]
    }
    
    return resObj
}

// async function main() {
//     let data = await getPaprika()
//     console.log(Object.keys(data))
//     const sql = [
//         "CREATE TABLE new_table (",
//         "TIMESTAMP int,",
//         Object.keys(data)
//           .map(k=>k+" char(255)")
//           .join("\n")
//         ,
//         ")",
//       ].join("\n");
//     console.log(sql)
// }

// main()