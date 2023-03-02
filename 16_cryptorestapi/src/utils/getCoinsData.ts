import { getCoinBase } from "../apis/coinbase";
import { getPaprika } from "../apis/coinpaprika";
import { getKucoin } from "../apis/kucoin";
import { getCoinStats } from "../apis/coinstats";

type CurrencyPrices = {
  kucoinPrice: number;
  coinStatsPrice: number;
  coinBasePrice: number;
  paprikaPrice: number;
};


export const getAllData = async (): Promise<{
  [key: string]: CurrencyPrices;
}> => {
  const paprika = await getPaprika();
  const coinBase = await getCoinBase();
  const kucoin = await getKucoin();
  const coinStats = await getCoinStats();

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
}
