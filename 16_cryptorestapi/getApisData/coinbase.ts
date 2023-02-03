import axios from 'axios'

require('dotenv').config()

const URL = "https://api.coinbase.com/v2/exchange-rates"
export async function getCoinBase() : Promise<{[key: string]: string}>  {
    const response = await axios.get(URL);

    const {data} = response.data
    const {rates} = data

    let currencies = Object.keys(rates)

    let resObj : {[key: string]: string} = {}
    /* 
    array contains object with fields name, symbol, price
    {
        "name": Bitcoin,
        "symbol": BTC,
        "price": USDPRICE,
    }
    */

    for (let currentCurrency of currencies){
        resObj[currentCurrency] = (1 / Number(rates[currentCurrency])).toString()
    }

    return resObj
}


