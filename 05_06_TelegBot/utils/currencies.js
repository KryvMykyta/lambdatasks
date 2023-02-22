import axios from "axios";
import fs from "fs";
import { resolve } from "path";

const DBNAME = "currencies.json";
const MONO_API_URL = "https://api.monobank.ua/bank/currency";
const PRIVAT_API_URL =
  "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5";

function getData(filename) {
  return JSON.parse(fs.readFileSync(filename, "utf8"));
}

function loadData(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), "utf8");
}

async function getMono() {
  const { data: currenciesInfo } = await axios.get(MONO_API_URL);
  let currencyRates = {};
  currenciesInfo.forEach((currencyInfo) => {
    if (
      currencyInfo.currencyCodeA === 840 &&
      currencyInfo.currencyCodeB === 980
    ) {
      currencyRates.monoUsdSell = Number(currencyInfo.rateSell);
      currencyRates.monoUsdBuy = Number(currencyInfo.rateBuy);
    }
    if (
      currencyInfo.currencyCodeA === 978 &&
      currencyInfo.currencyCodeB === 980
    ) {
      currencyRates.monoEurSell = Number(currencyInfo.rateSell);
      currencyRates.monoEurBuy = Number(currencyInfo.rateBuy);
    }
  });
  return currencyRates;
}

async function getPrivat() {
  const { data: currenciesInfo } = await axios.get(PRIVAT_API_URL);
  let currencyRates = {};
  currenciesInfo.forEach((currencyInfo) => {
    if (currencyInfo.ccy === "USD") {
      currencyRates.privatUsdSell = Number(currencyInfo.sale);
      currencyRates.privatUsdBuy = Number(currencyInfo.buy);
    }
    if (currencyInfo.ccy === "EUR") {
      currencyRates.privatEurSell = Number(currencyInfo.sale);
      currencyRates.privatEurBuy = Number(currencyInfo.buy);
    }
  });
  return currencyRates;
}

async function getExchange() {
  try {
    let exchangeRates = {};
    let privatRates = await getPrivat();
    let monoRates = await getMono();
    exchangeRates = Object.assign(privatRates, monoRates);
    loadData(DBNAME, exchangeRates);
    return exchangeRates;
  } catch (err) {
    console.log(err);
    return getData(DBNAME);
  }
}

export async function getUsdMessage() {
  const { monoUsdSell, monoUsdBuy, privatUsdSell, privatUsdBuy } =
    await getExchange();
  const messageString = `MonoBank : USD/UAH Sell:${monoUsdSell}, Buy: ${monoUsdBuy}\nPrivatBank: USD/UAH Sell:${privatUsdSell}, Buy: ${privatUsdBuy}`;
  return messageString;
}

export async function getEurMessage() {
  const { monoEurSell, monoEurBuy, privatEurSell, privatEurBuy } =
    await getExchange();
  const messageString = `MonoBank : EUR/UAH Sell:${monoEurSell}, Buy: ${monoEurBuy}\nPrivatBank: EUR/UAH Sell:${privatEurSell}, Buy: ${privatEurBuy}`;
  return messageString;
}
