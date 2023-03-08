import { DataFormatter } from "./../utils/DataFormatter";
import { exchanges } from "../schemas/schemas";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { and, eq, gte, lte } from "drizzle-orm/expressions";

export class ListingsRepository {
  CONN_STRING: string;
  db: NodePgDatabase;
  constructor(connectionString: string) {
    this.CONN_STRING = connectionString;
    const pool = new Pool({
      connectionString: this.CONN_STRING,
    });
    this.db = drizzle(pool);
  }
  public getAllData = async () => {
    return await this.db.select().from(exchanges);
  };

  public getDataByTime = async (time: number) => {
    const timeNow = new Date().getTime();
    const timeStart = timeNow - time;
    return await this.db
      .select()
      .from(exchanges)
      .where(gte(exchanges.time, timeStart));
  };

  public getDataByCurrencyTime = async (currency: string, time: number) => {
    const timeNow = new Date().getTime();
    const timeStart = timeNow - time;
    return await this.db
      .select()
      .from(exchanges)
      .where(
        and(gte(exchanges.time, timeStart), eq(exchanges.currency, currency))
      );
  };

  public getDataByCurrency = async (currency: string) => {
    return await this.db
      .select()
      .from(exchanges)
      .where(eq(exchanges.currency, currency));
  };

  public updateDB = async () => {
    try{
      const formatter = new DataFormatter();
      const uploadingData = await formatter.prepareToUpload();
      await this.db.insert(exchanges).values(...uploadingData);
      const twoDayAgoTime = new Date().getTime() - 2 * 24 * 60 * 60 * 1000;
      await this.db.delete(exchanges).where(lte(exchanges.time, twoDayAgoTime));
    } catch (err) {
      console.log(err)
    }
  };
}
