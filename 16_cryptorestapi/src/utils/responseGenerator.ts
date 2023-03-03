import { DataFormatter } from './DataFormatter';
import { CurrencyRecord } from "./../apis/responseTypes";
import { ListingsRepository } from "./../repository/ListingsRepository";
import { markets } from "../schemas/schemas";
import dotenv from "dotenv";
dotenv.config();
const CONN_STRING = process.env.DB_CONN_STRING

export class ResponseGenerator {
  public getResponse = async (
    time?: number,
    currency?: string,
    market?: markets
  ) => {
    const repository = new ListingsRepository(
      String(CONN_STRING)
    );
    let listingsByParameters: CurrencyRecord[];
    if (!currency) {
      if (!time) {
        console.log("any");
        listingsByParameters = await repository.getAllData();
      } else {
        console.log("time");
        listingsByParameters = await repository.getDataByTime(time);
      }
    } else {
      if (!time) {
        console.log("currency");
        listingsByParameters = await repository.getDataByCurrency(currency);
      } else {
        console.log("currency time");
        listingsByParameters = await repository.getDataByCurrencyTime(
          currency,
          time
        );
      }
    }
    const formatter = new DataFormatter()
    const responseData = formatter.mergeToAveragePrice(listingsByParameters, market)
    return responseData
  };
}