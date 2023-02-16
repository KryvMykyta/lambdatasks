import axios from 'axios'

type coinSymbol = string
type currencyInfo = {[key: string] : string | number}
type timeInfo = {[key : string] : number}
async function getLatestData(coinSymbol: coinSymbol) : Promise<currencyInfo> {
    const url = `http://54.93.215.166:3000?currency=${coinSymbol}&time=300000`
    const content = await axios.get(url)
    let {data} = content
    console.log(coinSymbol, data)
    if (data.length === 0) return {"currency": coinSymbol, "price": "No data"}
    return data[0]
}

export async function getLatestDataFromArray(currencies: Array<coinSymbol>) : Promise<Array<currencyInfo>> {
    let resData : Array<currencyInfo> = []
    for (let currency of currencies){
        resData = [...resData, await getLatestData(currency)]
    }
    console.log(resData)
    return resData
}

function formatListData(currenciesData: Array<currencyInfo>) : string {
    let messageArray : string[] = []
    currenciesData.map((currencyData) => {
        if (currencyData.price !== "No data"){
            let currencyPrice = Math.round(Number(currencyData.price)*100000)/100000
            messageArray.push(`/${currencyData.currency} $${String(currencyPrice)}`)
        }
        else {
            messageArray.push(`/${currencyData.currency} ${currencyData.price}`)
        }
    })
    let resultString = messageArray.join("\n")
    return resultString
}

async function getAllInfo(coinSymbol: string) : Promise<timeInfo> {
    let time = 24*60*60*1000 + 2.5*60*1000 + 500
    const url = `http://54.93.215.166:3000?currency=${coinSymbol}&time=${time}`
    const content = await axios.get(url)
    let {data} = content
    const timeStart = new Date().getTime()
    let resultData : {[key : string] : number}= {}
    data.map((listing : currencyInfo) => {
        let period = timeStart - Number(listing.time)
        let checkLatest = (period) <= 5*60*1000
        let checkThirty = (period) <= 30*60*1000 + 2.5*60*1000 + 500 && (period) >= 30*60*1000 - 2.5*60*1000 - 500
        let checkHour = (period) <= 60*60*1000 + 2.5*60*1000 + 500  && (period) >= 60*60*1000 - 2.5*60*1000- 500
        let checkThreeHours = (period) <= 3*60*60*1000 + 2.5*60*1000 + 500  && (period) >= 3*60*60*1000 - 2.5*60*1000- 500
        let checkSixHours = (period) <= 6*60*60*1000 + 2.5*60*1000 + 500  && (period) >= 6*60*60*1000 - 2.5*60*1000- 500
        let checkTwelweHours = (period) <= 12*60*60*1000 + 2.5*60*1000 + 500  && (period) >= 12*60*60*1000 - 2.5*60*1000- 500
        let checkTwentyFourHours = (period) <= 24*60*60*1000 + 2.5*60*1000 + 500  && (period) >= 24*60*60*1000 - 2.5*60*1000 - 500
        if (checkLatest) resultData["latest"] = Number(listing.price)
        if (checkThirty) resultData["Thirty"] = Number(listing.price)
        if (checkHour) resultData["Hour"] = Number(listing.price)
        if (checkThreeHours) resultData["ThreeHours"] = Number(listing.price)
        if (checkSixHours) resultData["SixHours"] = Number(listing.price)
        if (checkTwelweHours) resultData["TwelweHours"] = Number(listing.price)
        if (checkTwentyFourHours) resultData["TwentyFourHours"] = Number(listing.price)
    })
    return resultData
}

function formatFullData(timeInfo : timeInfo) : string{
    let str = `Latest: ${timeInfo.latest || "No Data"}\n`+
    `30min: ${timeInfo.Thirty || "No Data"}\n`+
    `1hour: ${timeInfo.Hour || "No Data"}\n`+ 
    `3hours: ${timeInfo.ThreeHours || "No Data"}\n`+
    `6hours: ${timeInfo.SixHours || "No Data"}\n`+
    `12hours: ${timeInfo.TwelweHours || "No Data"}\n`+
    `24hours: ${timeInfo.TwentyFourHours || "No Data"}`
    return str
}

export async function getMessageOfFullData(currency: string) {
    return formatFullData(await getAllInfo(currency))
}

export async function getMessageOfList(currenciesArr: Array<string>) {
    console.log("got currencies arr",currenciesArr)
    let data = await getLatestDataFromArray(currenciesArr)
    return formatListData(data)
}

async function main() {
    getAllInfo("BTC")
}

main()
