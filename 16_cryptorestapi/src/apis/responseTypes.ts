type CoinBaseRates = {
    [key:string]: number;
}

type CoinBaseData = {
    currency: string;
    rates: CoinBaseRates
}

export type CoinBaseResponse = {
    data: CoinBaseData
}

type CoinStatsType = {
    id: string;
    icon: string;
    name: string;
    symbol: string;
    rank: number;
    price: number;
    priceBtc: number;
    volume?: number;
    marketCap: number;
    availableSupply: any;
    totalSupply: any;
    priceChange1h: number;
    priceChange1d: number;
    priceChange1w: number;
    websiteUrl: string;
    twitterUrl: string;
    exp: string[];
    contractAddress: string;
    decimals?: number;
    redditUrl: string;
}

export type CoinStatsResponse = {
    coins: CoinStatsType[]
}

type KucoinRates = {
    [key:string]: number;
}

export type KucoinResponse = {
    code: string;
    data: KucoinRates
}

export type CoinListing = {
    [key: string]: number;
  };

type PaprikaCoinInfo = {
    price: number;
    volume_24h: number;
    volume_24h_change_24h: number;
    market_cap: any;
    market_cap_change_24h: number;
    percent_change_15m: number;
    percent_change_30m: number;
    percent_change_1h: number;
    percent_change_6h: number;
    percent_change_12h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    percent_change_1y: number;
    ath_price: number;
    ath_date: Date;
    percent_from_price_ath: number;
}

type Quotes = {
    USD: PaprikaCoinInfo;
}

export type PaprikaResponse = {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: any;
    total_supply: any;
    max_supply: any;
    beta_value: number;
    first_data_at: Date;
    last_updated: Date;
    quotes: Quotes;
}

export type CurrencyPrices = {
    kucoinPrice: number;
    coinStatsPrice: number;
    coinBasePrice: number;
    paprikaPrice: number;
  };

export type CurrencyRecord = {
    currency: string;
    kucoin: number;
    coinStats: number;
    coinBase: number;
    coinPaprika: number;
    time: number;
  };

export type MarketsData = {
    kucoin: CoinListing,
    coinBase: CoinListing,
    coinStats: CoinListing,
    paprika: CoinListing
};

export type ApiResponse = {
    currency: string;
    price: number;
    time:number;
}