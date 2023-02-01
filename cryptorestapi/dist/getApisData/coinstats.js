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
exports.getCoinStats = void 0;
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const URL = "https://api.coinstats.app/public/v1/coins?skip=0&limit=500";
function getCoinStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(URL);
        const { data } = response;
        const { coins } = data;
        let resObj = {};
        for (let listing of coins) {
            resObj[listing["symbol"].toString()] = listing["price"];
        }
        return resObj;
    });
}
exports.getCoinStats = getCoinStats;
