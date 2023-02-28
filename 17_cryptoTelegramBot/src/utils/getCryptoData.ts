import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

type coinSymbol = string;

type CurrencyInfo = {
  currency: coinSymbol;
  price: number | string;
  time: number;
};
type TimeInfo = {
  latest: number | undefined;
  thirtyMinutes: number | undefined;
  oneHour: number | undefined;
  threeHours: number | undefined;
  sixHours: number | undefined;
  twelveHours: number | undefined;
  twentyFourHours: number | undefined;
};

type CoinListing = {
  currency: string;
  time: number;
  price: string | number
}

const BASE_URL = "https://cryptorest.onrender.com/"

const getLatestData = async (coinSymbol: coinSymbol): Promise<CurrencyInfo> =>{
  const url = `${BASE_URL}?currency=${coinSymbol}&time=300000`;
  const { data: exchangeRecords } = await axios.get(url);
  if (!exchangeRecords)
    return {
      currency: coinSymbol,
      price: "No data",
      time: new Date().getTime(),
    };
  return exchangeRecords[0];
}

export const getLatestDataFromCoinsArray = async (
  currencies: Array<coinSymbol>
): Promise<Array<CurrencyInfo>> => {
  let currenciesPrices: Array<CurrencyInfo> = [];
  const promises = currencies.map(async (currency) => {
    const newCoinData = await getLatestData(currency)
    currenciesPrices.push(newCoinData);
  });
  await Promise.all(promises)
  return currenciesPrices;
}

const formatListData = (currenciesData: Array<CurrencyInfo>): string => {
  const messageArray: string[] = [];
  currenciesData.forEach((currencyData) => {
    let currencyPrice = currencyData.price;
    if (currencyPrice !== "No data") {
      currencyPrice = Math.round(Number(currencyPrice) * 100000) / 100000;
    }
    messageArray.push(`/${currencyData.currency} ${currencyPrice}`);
  });
  return messageArray.join("\n");
}

const getAllInfo = async (coinSymbol: string): Promise<TimeInfo> => {
  const timeOfOneDay = 24 * 60 * 60 * 1000;
  const url = `${BASE_URL}?currency=${coinSymbol}&time=${timeOfOneDay}`;
  const {data: coinListings} = await axios.get<any, AxiosResponse<Array<CoinListing>>>(url)
  const timeStart = new Date().getTime();
  const coinPrices: TimeInfo = {
    latest: undefined,
    thirtyMinutes: undefined,
    oneHour: undefined,
    threeHours: undefined,
    sixHours: undefined,
    twelveHours: undefined,
    twentyFourHours: undefined,
  };
  coinListings.forEach((listing: CurrencyInfo) => {
    const period = timeStart - listing.time;
    const thirtyMinutes = 30 * 60 * 1000
    const step = 2.5*60*1000
    const checkLatest = period <= 5 * 60 * 1000;
    const checkThirty =
      period <= thirtyMinutes + step &&
      period >= thirtyMinutes - step;
    const checkHour =
      period <= 2*thirtyMinutes + step &&
      period >= 2*thirtyMinutes - step;
    const checkThreeHours =
      period <= 6*thirtyMinutes + step &&
      period >= 6*thirtyMinutes - step;
    const checkSixHours =
      period <= 12*thirtyMinutes + step &&
      period >= 12*thirtyMinutes - step;
    const checkTwelweHours =
      period <= 24*thirtyMinutes + step &&
      period >= 24*thirtyMinutes - step;
    const checkTwentyFourHours =
      period <= 48*thirtyMinutes + step &&
      period >= 48*thirtyMinutes - step;
    if (checkLatest) coinPrices.latest = Number(listing.price);
    if (checkThirty) coinPrices.thirtyMinutes = Number(listing.price);
    if (checkHour) coinPrices.oneHour = Number(listing.price);
    if (checkThreeHours) coinPrices.threeHours = Number(listing.price);
    if (checkSixHours) coinPrices.sixHours = Number(listing.price);
    if (checkTwelweHours) coinPrices.twelveHours = Number(listing.price);
    if (checkTwentyFourHours) coinPrices.twentyFourHours = Number(listing.price);
  });
  return coinPrices;
}

const formatFullData = (TimeInfo: TimeInfo): string => {
  const message =
    `Latest: ${TimeInfo.latest || "No Data"}\n` +
    `30min: ${TimeInfo.thirtyMinutes || "No Data"}\n` +
    `1hour: ${TimeInfo.oneHour || "No Data"}\n` +
    `3hours: ${TimeInfo.threeHours || "No Data"}\n` +
    `6hours: ${TimeInfo.sixHours || "No Data"}\n` +
    `12hours: ${TimeInfo.twelveHours || "No Data"}\n` +
    `24hours: ${TimeInfo.twentyFourHours || "No Data"}`;
  return message;
}

export const getMessageOfFullData = async (currency: string) => {
  return formatFullData(await getAllInfo(currency));
}

export const getMessageOfCoinsList = async (currenciesArr: Array<string>) => {
  const coinsPrices = await getLatestDataFromCoinsArray(currenciesArr);
  return formatListData(coinsPrices);
}
