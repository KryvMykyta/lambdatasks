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
exports.getKucoin = void 0;
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const URL = "https://api.kucoin.com/api/v1/prices";
function getKucoin() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(URL);
        const { data } = response.data;
        let keys = Object.keys(data);
        let resObj = {};
        for (let el of keys) {
            resObj[el] = Number(data[el]);
        }
        return resObj;
    });
}
exports.getKucoin = getKucoin;
