import axios from "axios";

type CurrencyInfo = {
  currency: string;
  price: number | undefined;
  time: number;
};

export class DataCollector {
  BASE_URL: string;
  constructor(url: string) {
    this.BASE_URL = url;
  }
  public getLatestData = async (): Promise<CurrencyInfo[] | undefined> => {
    try {
      const url = `${this.BASE_URL}?time=300000`;
      const { data: exchangeRecords } = await axios.get<CurrencyInfo[]>(url);
      return exchangeRecords;
    } catch (err) {
      return undefined;
    }
  };

  public getLatestDataFromCoinsArray = async (
    currencies: Array<string>
  ): Promise<Array<CurrencyInfo> | undefined> => {
    if (currencies[0]) {
      const currenciesPrices = await this.getLatestData();
      const requiredCurrenciesPrices: CurrencyInfo[] = [];
      if (currenciesPrices) {
        currencies.map((currencyName) => {
          const currencyRecord = currenciesPrices.filter(
            (currencyListing) => currencyListing.currency === currencyName
          );
          if (currencyRecord[0]) {
            requiredCurrenciesPrices.push(currencyRecord[0]);
          } else {
            requiredCurrenciesPrices.push({
              currency: currencyName,
              price: undefined,
              time: new Date().getTime(),
            });
          }
        });
        return requiredCurrenciesPrices;
      }
    }
    return undefined;
  };

  public getDataForLastDay = async (
    coinSymbol: string
  ): Promise<CurrencyInfo[] | undefined> => {
    try {
      const timeOfOneDay = 24 * 60 * 60 * 1000;
      const url = `${this.BASE_URL}?currency=${coinSymbol}&time=${timeOfOneDay}`;
      const { data: exchangeRecords } = await axios.get<CurrencyInfo[]>(url);
      if (exchangeRecords[0]) {
        return exchangeRecords;
      }
      return undefined;
    } catch (err) {
      return undefined;
    }
  };
}

// async function main() {
//     const creator = new DataCollector("https://cryptorest.onrender.com/")
//     const msg = await creator.getLatestDataFromCoinsArray(["BTC","ETH","XYAS"])
//     console.log(msg)
// }

// main()
