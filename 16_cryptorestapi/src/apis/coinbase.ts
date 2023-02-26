import axios from "axios";

require("dotenv").config();

const URL = "https://api.coinbase.com/v2/exchange-rates";
export const getCoinBase = async (): Promise<{ [key: string]: number }> => {
  const {
    data: {
      data: { rates: currenciesRates },
    },
  } = await axios.get(URL);
  const currencySymbols = Object.keys(currenciesRates);
  currencySymbols.forEach(
    (currency) =>
      (currenciesRates[currency] = 1 / Number(currenciesRates[currency]))
  );
  return currenciesRates;
}
