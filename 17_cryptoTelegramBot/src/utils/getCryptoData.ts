import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

type coinSymbol = string;

type currencyInfo = {
  currency: coinSymbol;
  price: number | string;
  time: number;
};
type timeInfo = {
  latest: number | undefined;
  thirtyMinutes: number | undefined;
  oneHour: number | undefined;
  threeHours: number | undefined;
  sixHours: number | undefined;
  twelveHours: number | undefined;
  twentyFourHours: number | undefined;
};

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function getLatestData(coinSymbol: coinSymbol): Promise<currencyInfo> {
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

export async function getLatestDataFromCoinsArray(
  currencies: Array<coinSymbol>
): Promise<Array<currencyInfo>> {
  let currenciesPrices: Array<currencyInfo> = [];
  currencies.forEach(async (currency) => {
    currenciesPrices = [...currenciesPrices, await getLatestData(currency)];
  });
  return currenciesPrices;
}

function formatListData(currenciesData: Array<currencyInfo>): string {
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

async function getAllInfo(coinSymbol: string): Promise<timeInfo> {
  const timeOfOneDay = 24 * 60 * 60 * 1000;
  const url = `${BASE_URL}?currency=${coinSymbol}&time=${timeOfOneDay}`;
  const { data: coinListings } = await axios.get(url);
  const timeStart = new Date().getTime();
  const coinPrices: timeInfo = {
    latest: undefined,
    thirtyMinutes: undefined,
    oneHour: undefined,
    threeHours: undefined,
    sixHours: undefined,
    twelveHours: undefined,
    twentyFourHours: undefined,
  };
  coinListings.forEach((listing: currencyInfo) => {
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

function formatFullData(timeInfo: timeInfo): string {
  const message =
    `Latest: ${timeInfo.latest || "No Data"}\n` +
    `30min: ${timeInfo.thirtyMinutes || "No Data"}\n` +
    `1hour: ${timeInfo.oneHour || "No Data"}\n` +
    `3hours: ${timeInfo.threeHours || "No Data"}\n` +
    `6hours: ${timeInfo.sixHours || "No Data"}\n` +
    `12hours: ${timeInfo.twelveHours || "No Data"}\n` +
    `24hours: ${timeInfo.twentyFourHours || "No Data"}`;
  return message;
}

export async function getMessageOfFullData(currency: string) {
  return formatFullData(await getAllInfo(currency));
}

export async function getMessageOfCoinsList(currenciesArr: Array<string>) {
  const coinsPrices = await getLatestDataFromCoinsArray(currenciesArr);
  return formatListData(coinsPrices);
}
