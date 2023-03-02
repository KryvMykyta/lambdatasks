import { exchanges } from "../schemas/schemas";
import { getAllData } from "./getCoinsData";
import { gte, lte, eq, and } from "drizzle-orm/expressions";
import { Pool } from 'pg';
import dotenv from "dotenv";
import { drizzle } from 'drizzle-orm/node-postgres';
dotenv.config({ path: "../.env" });

type CurrencyRecord = {
  currency: string;
  kucoin: number;
  coinStats: number;
  coinBase: number;
  coinPaprika: number;
  time: number;
};

export const uploadData = async () => {
  const pool = new Pool({
    connectionString: process.env.DB_CONN_STRING,
  });

  const db = drizzle(pool);

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
  const twoDayAgoTime = new Date().getTime() - 2*24*60*60*1000
  await db.delete(exchanges).where(lte(exchanges.time,twoDayAgoTime))
}
