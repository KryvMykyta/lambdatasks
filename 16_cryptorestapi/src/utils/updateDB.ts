import { exchanges } from "../schemas/schemas";
import { getAllData } from "./getCoinsData";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
dotenv.config({ path: "../.env" });

type CurrencyRecord = {
  currency: string;
  kucoin: number;
  coinStats: number;
  coinBase: number;
  coinPaprika: number;
  time: number;
};

export async function uploadData() {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: "crypto",
    password: process.env.DB_PASS,
  });
  const db = drizzle(connection);

  const time = new Date().getTime();
  const currenciesRates = await getAllData();

  const uploadingData: Array<CurrencyRecord> = [];
  const currencies = Object.keys(currenciesRates);
  currencies.forEach((currency) => {
    const markets = currenciesRates[currency];
    uploadingData.push({
      currency: currency,
      kucoin: markets.kucoinPrice,
      coinStats: markets.coinStatsPrice,
      coinBase: markets.coinBasePrice,
      coinPaprika: markets.paprikaPrice,
      time: time
    });

  });
  await db.insert(exchanges).values(...uploadingData)
}
