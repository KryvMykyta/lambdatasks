import axios from "axios";
import { resolve } from "path";
require("dotenv").config();

const URL = "https://api.coinpaprika.com/v1/tickers";
export const getPaprika = async (): Promise<{ [key: string]: number }> => {
  const { data: currencyListings } = await axios.get(URL);
  const currenciesRates: { [key: string]: number } = {};
  currencyListings.forEach((currencyListing: { [key: string]: any }) => {
    const currencySymbol = currencyListing.symbol.toString();
    const {
      quotes: {
        USD: { price: currencyPrice },
      },
    } = currencyListing;
    currenciesRates[currencySymbol] = currencyPrice;
  });

  return currenciesRates;
}
