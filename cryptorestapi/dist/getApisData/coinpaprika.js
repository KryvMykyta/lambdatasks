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
exports.getPaprika = void 0;
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const URL = "https://api.coinpaprika.com/v1/tickers";
function getPaprika() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(URL);
        const { data } = response;
        let resObj = {};
        for (let listing of data) {
            resObj[listing["symbol"].toString()] = listing["quotes"]["USD"]["price"];
        }
        return resObj;
    });
}
exports.getPaprika = getPaprika;
// async function main() {
//     let data = await getPaprika()
//     console.log(Object.keys(data))
//     const sql = [
//         "CREATE TABLE new_table (",
//         "TIMESTAMP int,",
//         Object.keys(data)
//           .map(k=>k+" char(255)")
//           .join("\n")
//         ,
//         ")",
//       ].join("\n");
//     console.log(sql)
// }
// main()
