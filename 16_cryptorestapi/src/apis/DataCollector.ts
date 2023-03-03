import {
  CoinBaseResponse,
  CoinListing,
  CoinStatsResponse,
  KucoinResponse,
  MarketsData,
  PaprikaResponse,
} from "./responseTypes";
import axios from "axios";

export class DataCollector {
  private getCoinBase = async (): Promise<CoinListing> => {
    const URL = "https://api.coinbase.com/v2/exchange-rates";
    const {
      data: {
        data: { rates: currenciesRates },
      },
    } = await axios.get<CoinBaseResponse>(URL);
    const currencySymbols = Object.keys(currenciesRates);
    currencySymbols.forEach(
      (currency) =>
        (currenciesRates[currency] = 1 / Number(currenciesRates[currency]))
    );
    return currenciesRates;
  };

  private getCoinStats = async (): Promise<CoinListing> => {
    const URL = "https://api.coinstats.app/public/v1/coins?skip=0&limit=500";
    const {
      data: { coins: listings },
    } = await axios.get<CoinStatsResponse>(URL);
    const currenciesRates: CoinListing = {};
    listings.forEach((listing) => {
      const currencySymbol = listing.symbol.toString();
      const currencyPrice = listing.price;
      currenciesRates[currencySymbol] = currencyPrice;
    });
    return currenciesRates;
  };

  private getKucoin = async (): Promise<CoinListing> => {
    const URL = "https://api.kucoin.com/api/v1/prices";
    const {
      data: { data: currenciesRates },
    } = await axios.get<KucoinResponse>(URL);
    const currencySymbols = Object.keys(currenciesRates);
    currencySymbols.forEach(
      (currency) =>
        (currenciesRates[currency] = Number(currenciesRates[currency]))
    );
    return currenciesRates;
  };

  private getPaprika = async (): Promise<CoinListing> => {
    const URL = "https://api.coinpaprika.com/v1/tickers";
    const { data: currencyListings } = await axios.get<PaprikaResponse[]>(URL);
    const currenciesRates: CoinListing = {};
    currencyListings.forEach((currencyListing) => {
      const currencySymbol = currencyListing.symbol.toString();
      const {
        quotes: {
          USD: { price: currencyPrice },
        },
      } = currencyListing;
      currenciesRates[currencySymbol] = currencyPrice;
    });

    return currenciesRates;
  };

  public collectData = async (): Promise<MarketsData> => {
    return {
      kucoin: await this.getKucoin(),
      coinBase: await this.getCoinBase(),
      coinStats: await this.getCoinStats(),
      paprika: await this.getPaprika(),
    };
  };
}