"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllData = void 0;
const coinbase_1 = require("./coinbase");
const coinpaprika_1 = require("./coinpaprika");
const kucoin_1 = require("./kucoin");
const coinstats_1 = require("./coinstats");
function getAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        const paprika = yield (0, coinpaprika_1.getPaprika)();
        const coinBase = yield (0, coinbase_1.getCoinBase)();
        const kucoin = yield (0, kucoin_1.getKucoin)();
        const coinStats = yield (0, coinstats_1.getCoinStats)();
        // const marketCap = await getMarketCap()
        let paprikaCurrencies = Object.keys(paprika);
        let coinBaseCurrencies = Object.keys(coinBase);
        let coinStatsCurrencies = Object.keys(coinStats);
        let kucoinCurrencies = Object.keys(kucoin);
        // let marketCapCurrencies : Array<string> = Object.keys(marketCap)
        let currencies = [...new Set([...paprikaCurrencies, ...coinBaseCurrencies, ...kucoinCurrencies, ...coinStatsCurrencies])];
        let allCurrencies = currencies.filter((el) => {
            return paprikaCurrencies.includes(el) && coinBaseCurrencies.includes(el) && coinStatsCurrencies.includes(el) && kucoinCurrencies.includes(el);
        });
        let resObj = {};
        for (let currency of allCurrencies) {
            let paprikaPrice = paprika[currency].toString();
            // let marketCapPrice = marketCap[currency].toString()
            let kucoinPrice = kucoin[currency].toString();
            let coinBasePrice = coinBase[currency].toString();
            let coinStatsPrice = coinStats[currency].toString();
            let exchangesMarkets = {
                "kucoinPrice": kucoinPrice,
                "coinStatsPrice": coinStatsPrice,
                "coinBasePrice": coinBasePrice,
                // "marketCapPrice": marketCapPrice,
                "paprikaPrice": paprikaPrice,
            };
            resObj[currency] = exchangesMarkets;
        }
        return resObj;
    });
}
exports.getAllData = getAllData;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(yield getAllData());
    });
}
main();
