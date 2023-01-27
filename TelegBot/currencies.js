import axios from "axios";
import fs from 'fs'
import { resolve } from "path";

const DBNAME = "currencies.json"

function getData(filename){
    const resData = fs.readFileSync(filename, 'utf8');
    return JSON.parse(resData)
}

function loadData(filename, content){
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8')
}
async function getMono(){
    let content = await axios.get("https://api.monobank.ua/bank/currency")
    content = content.data
    let resObj = {}
    for (let obj of content){
        if (obj.currencyCodeA === 840 && obj.currencyCodeB === 980){
            resObj.monoUsdSell = Number(obj.rateSell)
            resObj.monoUsdBuy = Number(obj.rateBuy)
        }
        if (obj.currencyCodeA === 978 && obj.currencyCodeB === 980){
            resObj.monoEurSell = Number(obj.rateSell)
            resObj.monoEurBuy = Number(obj.rateBuy)
        }
    }
    return resObj
}

async function getPrivat(){
    let content = await axios.get("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
    content = content.data
    let resObj = {}
    for (let obj of content){
        if (obj.ccy === "USD"){
            resObj.privatUsdSell = Number(obj.sale)
            resObj.privatUsdBuy = Number(obj.buy)
        }
        if (obj.ccy === "EUR"){
            resObj.privatEurSell = Number(obj.sale)
            resObj.privatEurBuy = Number(obj.buy)
        }
    }
    return resObj
}

async function getExchange(){
    let data = getData(DBNAME)
    if (data === {}){
        let resObj = {}
        let privat = await getPrivat()
        let mono = await getMono()
        resObj = Object.assign(privat,mono)
        resObj.time = Date.now()
        loadData(DBNAME,resObj)
        return resObj
    }
    if (Date.now() - data.time < 120*(10**3)){
        return data
    }
    else {
        let resObj = {}
        let privat = await getPrivat()
        let mono = await getMono()
        resObj = Object.assign(privat,mono)
        resObj.time = Date.now()
        loadData(DBNAME,resObj)
        return resObj
    }
}

export async function getUsd(){
    let data = await getExchange()
    let resStr = `MonoBank : USD/UAH Sell:${data.monoUsdSell}, Buy: ${data.monoUsdBuy}\nPrivatBank: USD/UAH Sell:${data.privatUsdSell}, Buy: ${data.privatUsdBuy}`
    return resStr
}

export async function getEur(){
    let data = await getExchange()
    let resStr = `MonoBank : EUR/UAH Sell:${data.monoEurSell}, Buy: ${data.monoEurBuy}\nPrivatBank: EUR/UAH Sell:${data.privatEurSell}, Buy: ${data.privatEurBuy}`
    return resStr
}

