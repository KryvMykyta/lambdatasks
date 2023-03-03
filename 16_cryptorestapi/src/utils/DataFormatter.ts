import { markets } from "./../schemas/schemas";
import { DataCollector } from "../apis/dataCollector";
import { CurrencyPrices, CurrencyRecord } from "../apis/responseTypes";

export class DataFormatter {
  public mergeCoinsData = async (): Promise<{
    [key: string]: CurrencyPrices;
  }> => {
    const dataCollector = new DataCollector();
    const { paprika, coinBase, coinStats, kucoin } =
      await dataCollector.collectData();

    const paprikaCurrencies = Object.keys(paprika);
    const coinBaseCurrencies = Object.keys(coinBase);
    const coinStatsCurrencies = Object.keys(coinStats);
    const kucoinCurrencies = Object.keys(kucoin);

    const allCurrenciesSymbols = [
      ...new Set([
        ...paprikaCurrencies,
        ...coinBaseCurrencies,
        ...kucoinCurrencies,
        ...coinStatsCurrencies,
      ]),
    ];

    const currenciesInEvery = allCurrenciesSymbols.filter((currencySymbol) => {
      return (
        paprikaCurrencies.includes(currencySymbol) &&
        coinBaseCurrencies.includes(currencySymbol) &&
        coinStatsCurrencies.includes(currencySymbol) &&
        kucoinCurrencies.includes(currencySymbol)
      );
    });

    const currencyRates: { [key: string]: CurrencyPrices } = {};
    currenciesInEvery.forEach((currency) => {
      const paprikaPrice = paprika[currency];
      const kucoinPrice = kucoin[currency];
      const coinBasePrice = coinBase[currency];
      const coinStatsPrice = coinStats[currency];

      const exchangesMarkets = {
        kucoinPrice: kucoinPrice,
        coinStatsPrice: coinStatsPrice,
        coinBasePrice: coinBasePrice,
        paprikaPrice: paprikaPrice,
      };
      currencyRates[currency] = exchangesMarkets;
    });

    return currencyRates;
  };

  public prepareToUpload = async () => {
    const time = new Date().getTime();
    const currenciesRates = await this.mergeCoinsData();

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
        time: time,
      });
    });
    return uploadingData;
  };

  public mergeToAveragePrice = (
    currenciesRecords: CurrencyRecord[],
    market: markets | undefined
  ) => {
    const mergedList: {
      currency: string;
      price: number;
      time: number;
    }[] = [];
    if (!market) {
      console.log("nomarket");
      currenciesRecords.forEach((currencyRecord) => {
        const averagePrice =
          (currencyRecord.coinBase +
            currencyRecord.coinPaprika +
            currencyRecord.coinStats +
            currencyRecord.kucoin) /
          4;
        mergedList.push({
          currency: currencyRecord.currency,
          price: averagePrice,
          time: currencyRecord.time,
        });
      });
      return mergedList;
    }
    console.log(market);
    
    currenciesRecords.forEach((exchangeListing) => {
      const markets = ["kucoin","coinStats", "coinBase", "coinPaprika"]
      if (!markets.includes(market)) {
        mergedList.push({
          currency: exchangeListing.currency,
          price: 0,
          time: exchangeListing.time,
        });
      }else {
        const averagePrice = exchangeListing[market];
        console.log(averagePrice);
        mergedList.push({
          currency: exchangeListing.currency,
          price: averagePrice,
          time: exchangeListing.time,
        });
      }
      
    });
    return mergedList;
  };
}
