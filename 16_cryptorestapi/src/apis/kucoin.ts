import axios from "axios";
import { resolve } from "path";
require("dotenv").config();

const URL = "https://api.kucoin.com/api/v1/prices";
export const getKucoin = async (): Promise<{ [key: string]: number }> => {
  const {
    data: { data: currenciesRates },
  } = await axios.get(URL);
  const currencySymbols = Object.keys(currenciesRates);
  currencySymbols.forEach(
    (currency) =>
      (currenciesRates[currency] = Number(currenciesRates[currency]))
  );
  return currenciesRates;
}
