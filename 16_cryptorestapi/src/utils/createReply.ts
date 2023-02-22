import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

function getSqlQuery(time?: number, currency?: string, market?: string) {
  if (!currency) {
    if (!time) {
      if (!market) {
        // filter by none
        return "SELECT * FROM exchanges";
      }
      // filter by market
      return `SELECT currency, ${market}, time FROM exchanges`;
    }
    const timeNow = new Date().getTime();
    const timeStart = timeNow - Number(time);
    if (!market) {
      // filter by time
      return `SELECT * FROM exchanges WHERE time > ${timeStart}`;
    }
    // filter by market, time
    return `SELECT currency, ${market}, time FROM exchanges WHERE time > ${timeStart}`;
  }
  if (!time) {
    if (!market) {
      // filter by currency
      return `SELECT * FROM exchanges WHERE currency = '${currency}'`;
    }
    // filter by currency,market
    return `SELECT currency, ${market}, time FROM exchanges WHERE currency = '${currency}'`;
  }
  const timeNow = new Date().getTime();
  const timeStart = timeNow - Number(time);
  if (!market) {
    // filter by time, currency
    return `SELECT * FROM exchanges WHERE currency = '${currency}' AND time > ${timeStart}`;
  }
  // filter by market, time, currency
  return `SELECT currency, ${market}, time FROM exchanges WHERE currency = '${currency}' AND time > ${timeStart}`;
}

function createArrayCurrencyPrices(
  currenciesListings: Array<{ [key: string]: string | number }>
) {
  const currenciesRates: Array<{ [key: string]: string | number }> = [];
  currenciesListings.forEach((listing) => {
    const listingParameters = Object.keys(listing);
    let averagePrice = 0;
    listingParameters.forEach((parameter) => {
      if (parameter !== "time" && parameter !== "currency") {
        averagePrice +=
          Number(listing[parameter]) / (listingParameters.length - 2);
      }
    });
    currenciesRates.push({
      currency: listing["currency"],
      price: averagePrice,
      time: listing["time"],
    });
  });
  return currenciesRates;
}

export function getReplyInfo(
  time?: number,
  currency?: string,
  market?: string
) {
  const sqlQuery = getSqlQuery(time, currency, market);
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: "crypto",
    password: process.env.DB_PASS,
  });

  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  let replyInfo: Array<{ [key: string]: string | number }> = [];

  connection.query(
    sqlQuery,
    function (
      err: Error,
      currenciesListings: Array<{ [key: string]: string | number }>
    ) {
      if (err) throw err;
      replyInfo = createArrayCurrencyPrices(currenciesListings);
    }
  );
  return replyInfo;
}
