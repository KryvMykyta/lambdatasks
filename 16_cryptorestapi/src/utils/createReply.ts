import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { exchanges, markets } from "../schemas/schemas";
import { gte, eq, and } from "drizzle-orm/expressions";
dotenv.config({ path: "../.env" });

type CurrencyRecord = {
  currency: string;
  kucoin: number;
  coinStats: number;
  coinBase: number;
  coinPaprika: number;
  time: number;
};

export async function getReplyInfo(
  time?: number,
  currency?: string,
  market?: markets
) {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: "crypto",
    password: process.env.DB_PASS,
  });
  const db = drizzle(connection);
  let listingsByCurrencyTime: CurrencyRecord[] = [];
  if (!currency) {
    if (!time) {
      listingsByCurrencyTime = await db.select().from(exchanges);
    } else {
      const timeNow = new Date().getTime();
      const timeStart = timeNow - time;
      listingsByCurrencyTime = await db
        .select()
        .from(exchanges)
        .where(gte(exchanges.time, timeStart));
    }
  } else {
    if (!time) {
      listingsByCurrencyTime = await db.select().from(exchanges);
    } else {
      const timeNow = new Date().getTime();
      const timeStart = timeNow - time;
      listingsByCurrencyTime = await db
        .select()
        .from(exchanges)
        .where(
          and(gte(exchanges.time, timeStart), eq(exchanges.currency, currency))
        );
    }
  }
  let listingsByParameters: {
    currency: string;
    price: number;
    time: number;
  }[] = [];
  if (!market) {
    listingsByCurrencyTime.forEach((exchangeListing) => {
      const averagePrice =
        (exchangeListing.coinBase +
          exchangeListing.coinPaprika +
          exchangeListing.coinStats +
          exchangeListing.kucoin) /
        4;
      listingsByParameters.push({
        currency: exchangeListing.currency,
        price: averagePrice,
        time: exchangeListing.time,
      });
    });
    return listingsByParameters;
  }
  listingsByCurrencyTime.forEach((exchangeListing) => {
    const averagePrice = exchangeListing[market];
    listingsByParameters.push({
      currency: exchangeListing.currency,
      price: averagePrice,
      time: exchangeListing.time,
    });
  });
  return listingsByParameters;
}
