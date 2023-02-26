import axios from "axios";
require("dotenv").config();

const URL = "https://api.coinstats.app/public/v1/coins?skip=0&limit=500";
export const getCoinStats = async (): Promise<{ [key: string]: number }> => {
  const {
    data: { coins: listings },
  } = await axios.get(URL);
  const currenciesRates: { [key: string]: number } = {};
  listings.forEach((listing: { [key: string]: any }) => {
    const currencySymbol = listing.symbol.toString();
    const currencyPrice = listing.price;
    currenciesRates[currencySymbol] = currencyPrice;
  });
  return currenciesRates;
}
