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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageOfList = exports.getMessageOfFullData = exports.getLatestDataFromArray = void 0;
const axios_1 = __importDefault(require("axios"));
function getLatestData(coinSymbol) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `http://54.93.215.166:3000?currency=${coinSymbol}&time=300000`;
        const content = yield axios_1.default.get(url);
        let { data } = content;
        console.log(coinSymbol, data);
        if (data.length === 0)
            return { "currency": coinSymbol, "price": "No data" };
        return data[0];
    });
}
function getLatestDataFromArray(currencies) {
    return __awaiter(this, void 0, void 0, function* () {
        let resData = [];
        for (let currency of currencies) {
            resData = [...resData, yield getLatestData(currency)];
        }
        console.log(resData);
        return resData;
    });
}
exports.getLatestDataFromArray = getLatestDataFromArray;
function formatListData(currenciesData) {
    let messageArray = [];
    currenciesData.map((currencyData) => {
        if (currencyData.price !== "No data") {
            let currencyPrice = Math.round(Number(currencyData.price) * 100000) / 100000;
            messageArray.push(`/${currencyData.currency} $${String(currencyPrice)}`);
        }
        else {
            messageArray.push(`/${currencyData.currency} ${currencyData.price}`);
        }
    });
    let resultString = messageArray.join("\n");
    return resultString;
}
function getAllInfo(coinSymbol) {
    return __awaiter(this, void 0, void 0, function* () {
        let time = 24 * 60 * 60 * 1000 + 2.5 * 60 * 1000 + 500;
        const url = `http://54.93.215.166:3000?currency=${coinSymbol}&time=${time}`;
        const content = yield axios_1.default.get(url);
        let { data } = content;
        const timeStart = new Date().getTime();
        let resultData = {};
        data.map((listing) => {
            let period = timeStart - Number(listing.time);
            let checkLatest = (period) <= 5 * 60 * 1000;
            let checkThirty = (period) <= 30 * 60 * 1000 + 2.5 * 60 * 1000 + 500 && (period) >= 30 * 60 * 1000 - 2.5 * 60 * 1000 - 500;
            let checkHour = (period) <= 60 * 60 * 1000 + 2.5 * 60 * 1000 + 500 && (period) >= 60 * 60 * 1000 - 2.5 * 60 * 1000 - 500;
            let checkThreeHours = (period) <= 3 * 60 * 60 * 1000 + 2.5 * 60 * 1000 + 500 && (period) >= 3 * 60 * 60 * 1000 - 2.5 * 60 * 1000 - 500;
            let checkSixHours = (period) <= 6 * 60 * 60 * 1000 + 2.5 * 60 * 1000 + 500 && (period) >= 6 * 60 * 60 * 1000 - 2.5 * 60 * 1000 - 500;
            let checkTwelweHours = (period) <= 12 * 60 * 60 * 1000 + 2.5 * 60 * 1000 + 500 && (period) >= 12 * 60 * 60 * 1000 - 2.5 * 60 * 1000 - 500;
            let checkTwentyFourHours = (period) <= 24 * 60 * 60 * 1000 + 2.5 * 60 * 1000 + 500 && (period) >= 24 * 60 * 60 * 1000 - 2.5 * 60 * 1000 - 500;
            if (checkLatest)
                resultData["latest"] = Number(listing.price);
            if (checkThirty)
                resultData["Thirty"] = Number(listing.price);
            if (checkHour)
                resultData["Hour"] = Number(listing.price);
            if (checkThreeHours)
                resultData["ThreeHours"] = Number(listing.price);
            if (checkSixHours)
                resultData["SixHours"] = Number(listing.price);
            if (checkTwelweHours)
                resultData["TwelweHours"] = Number(listing.price);
            if (checkTwentyFourHours)
                resultData["TwentyFourHours"] = Number(listing.price);
        });
        return resultData;
    });
}
function formatFullData(timeInfo) {
    let str = `Latest: ${timeInfo.latest}\n` +
        `30min: ${timeInfo.Thirty}\n` +
        `1hour: ${timeInfo.Hour}\n` +
        `3hours: ${timeInfo.ThreeHours}\n` +
        `6hours: ${timeInfo.SixHours}\n` +
        `12hours: ${timeInfo.TwelweHours}\n` +
        `24hours: ${timeInfo.TwentyFourHours}`;
    return str;
}
function getMessageOfFullData(currency) {
    return __awaiter(this, void 0, void 0, function* () {
        return formatFullData(yield getAllInfo(currency));
    });
}
exports.getMessageOfFullData = getMessageOfFullData;
function getMessageOfList(currenciesArr) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("got currencies arr", currenciesArr);
        let data = yield getLatestDataFromArray(currenciesArr);
        return formatListData(data);
    });
}
exports.getMessageOfList = getMessageOfList;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        getAllInfo("BTC");
    });
}
main();
