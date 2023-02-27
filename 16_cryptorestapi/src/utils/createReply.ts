import dotenv from "dotenv";
import { exchanges, markets } from "../schemas/schemas";
import { gte, lte, eq, and } from "drizzle-orm/expressions";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
dotenv.config({ path: "../.env" });

type CurrencyRecord = {
  currency: string;
  kucoin: number;
  coinStats: number;
  coinBase: number;
  coinPaprika: number;
  time: number;
};

export const getReplyInfo = async (
  time?: number,
  currency?: string,
  market?: markets
) => {
  const pool = new Pool({
    connectionString: process.env.DB_CONN_STRING,
  });

  const db = drizzle(pool);

  let listingsByCurrencyTime: CurrencyRecord[] = [];
  if (!currency) {
    if (!time) {
      console.log("any")
      listingsByCurrencyTime = await db.select().from(exchanges);
    } else {
      console.log("time")
      const timeNow = new Date().getTime();
      const timeStart = timeNow - time;
      listingsByCurrencyTime = await db
        .select()
        .from(exchanges)
        .where(gte(exchanges.time, timeStart));
    }
  } else {
    if (!time) {
      console.log("currency")
      listingsByCurrencyTime = await db.select().from(exchanges).where(eq(exchanges.currency,currency));
    } else {
      console.log("currency time")
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
  const listingsByParameters: {
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
