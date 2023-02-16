import { getCoinBase } from "./coinbase";
import { getMarketCap } from "./coinmarketcap";
import { getPaprika } from "./coinpaprika";
import { getKucoin } from "./kucoin";
import { getCoinStats } from "./coinstats";
export async function getAllData() : Promise<{[key: string]: {[key: string]: string}}> {
    const paprika = await getPaprika()
    const coinBase = await getCoinBase()
    const kucoin = await getKucoin()
    const coinStats = await getCoinStats()
    // const marketCap = await getMarketCap()

    let paprikaCurrencies : Array<string> = Object.keys(paprika)
    let coinBaseCurrencies : Array<string> = Object.keys(coinBase)
    let coinStatsCurrencies : Array<string> = Object.keys(coinStats)
    let kucoinCurrencies : Array<string> = Object.keys(kucoin)
    // let marketCapCurrencies : Array<string> = Object.keys(marketCap)

    let currencies : Array<string>= [...new Set([...paprikaCurrencies, ...coinBaseCurrencies, ...kucoinCurrencies, ...coinStatsCurrencies])];
    let allCurrencies = currencies.filter((el) => {
        return paprikaCurrencies.includes(el) && coinBaseCurrencies.includes(el) && coinStatsCurrencies.includes(el) && kucoinCurrencies.includes(el) 
    })

    let resObj : {[key: string]: {[key: string]: string}} = {}
    for( let currency of allCurrencies) {
        let paprikaPrice = paprika[currency].toString()
        // let marketCapPrice = marketCap[currency].toString()
        let kucoinPrice = kucoin[currency].toString()
        let coinBasePrice = coinBase[currency].toString()
        let coinStatsPrice = coinStats[currency].toString()

        let exchangesMarkets = {
            "kucoinPrice": kucoinPrice,
            "coinStatsPrice": coinStatsPrice,
            "coinBasePrice": coinBasePrice,
            // "marketCapPrice": marketCapPrice,
            "paprikaPrice": paprikaPrice,
        }

        resObj[currency] = exchangesMarkets
    }

    return resObj

    
}

async function main() {
    console.log(await getAllData())
}

main()
