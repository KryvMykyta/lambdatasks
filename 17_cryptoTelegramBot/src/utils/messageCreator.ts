import { DataCollector } from "./dataCollector";
const BASE_URL = "https://cryptorest.onrender.com/"
const ERR_MESSAGE = "Oops, something went wrong, try make a request later or change your request."
const REQUEST_INTERVAL = 300000

export class MessageCreator {
    public latestForCurrencyList = async (currencyList: string[]) => {
        const collectorInstance = new DataCollector(BASE_URL)
        const currencyListPrices = await collectorInstance.getLatestDataFromCoinsArray(currencyList)
        if(currencyListPrices){
            let message = ""
            currencyListPrices.map((currencyPrice) => {
                message+=`/${currencyPrice.currency} $${currencyPrice.price}\n`
            })
            return message
        }
        return ERR_MESSAGE
    }

    public currencyOneDayMessage = async (currency: string) => {
        if(!currency){
            return ERR_MESSAGE
        }
        const collectorInstance = new DataCollector(BASE_URL)
        const currencyPrices = await collectorInstance.getDataForLastDay(currency)
        if(currencyPrices){
            let message = `${currency} prices for the last day: \n`
            const hour = 60*60*1000
            const indexesByTime : {[key: string] : number} = {
                latest: 1,
                halfHour: 0.5*hour/REQUEST_INTERVAL,
                hour: hour/REQUEST_INTERVAL,
                threeHours: 3*hour/REQUEST_INTERVAL,
                sixHours: 6*hour/REQUEST_INTERVAL,
                twelveHours: 12*hour/REQUEST_INTERVAL,
                twentyFourHours: 24*hour/REQUEST_INTERVAL
            }
            const intervals = Object.keys(indexesByTime)
            intervals.map((interval) => {
                const currencyRecordByIndex = currencyPrices[indexesByTime[interval]-1]
                const currentPrice = currencyRecordByIndex.price
                message += `${interval}:  ${currentPrice}\n`
            })
            return message
        }
        return ERR_MESSAGE
    }
}
