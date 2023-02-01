import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config({path:"../.env"})


const URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=500"
const API = process.env.MARKETCAPAPI
export async function getMarketCap() : Promise<{[key: string]: number}>  {
  const response = await axios.get(URL, {
    headers: {
      'X-CMC_PRO_API_KEY': API,
    },
  });

  const {data} = response.data

  let resObj : {[key: string]: number} = {}

  for (let listing of data){
      resObj[listing["symbol"]] = listing["quote"]["USD"]["price"]
  }

  return resObj
}
