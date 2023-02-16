"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.uploadData = exports.createTable = exports.createDB = void 0;
const getAllData_1 = require("../getApisData/getAllData");
const mysql_1 = __importDefault(require("mysql"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: "../.env" });
/* Update data
    "INSERT INTO Exchanges (Currency, Kucoin, Paprika, CoinBase, CoinStats, Time) VALUES (CurrencyName, KucoinPrice, PaprikaPrice, CoinBasePrice, CoinStatsPrice, Time)";
*/
function createDB() {
    const connection = mysql_1.default.createConnection({
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });
    connection.connect(function (err) {
        if (err)
            throw err;
    });
    connection.query("CREATE DATABASE IF NOT EXISTS crypto", function (err, result) {
        if (err)
            throw err;
        console.log("Database created");
    });
    connection.end();
}
exports.createDB = createDB;
function createTable() {
    const connection = mysql_1.default.createConnection({
        host: process.env.HOST,
        user: process.env.DB_USER,
        database: "crypto",
        password: process.env.DB_PASS
    });
    connection.connect(function (err) {
        if (err)
            throw err;
    });
    const sql = [
        "CREATE TABLE IF NOT EXISTS exchanges (",
        "currency VARCHAR(255) CHARACTER SET utf8mb4,",
        "kucoin VARCHAR(255) CHARACTER SET utf8mb4,",
        "coinStats VARCHAR(255) CHARACTER SET utf8mb4,",
        "coinBase VARCHAR(255) CHARACTER SET utf8mb4,",
        // "coinMarketCap VARCHAR(255) CHARACTER SET utf8mb4,",
        "coinPaprika VARCHAR(255) CHARACTER SET utf8mb4,",
        "time BIGINT",
        ")"
    ].join("\n");
    connection.query(sql, function (err, result) {
        if (err)
            throw err;
        console.log("table created");
    });
    connection.end();
}
exports.createTable = createTable;
function uploadData() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = mysql_1.default.createConnection({
            host: process.env.HOST,
            user: process.env.DB_USER,
            database: "crypto",
            password: process.env.DB_PASS
        });
        console.log("updating");
        connection.connect(function (err) {
            if (err)
                console.log(err);
        });
        console.log("connected");
        const time = new Date().getTime();
        const data = yield (0, getAllData_1.getAllData)();
        let loadingData = [];
        let currencies = Object.keys(data);
        for (let currency of currencies) {
            let markets = data[currency];
            let prices = [currency, markets["kucoinPrice"], markets["coinStatsPrice"], markets["coinBasePrice"], markets["paprikaPrice"], time];
            loadingData.push(prices);
        }
        console.log("loading: \n", loadingData);
        let sql = `INSERT INTO exchanges (currency, kucoin, coinStats, coinBase, coinPaprika, time) VALUES ?`;
        connection.query(sql, [loadingData], function (err, result) {
            if (err)
                throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });
        connection.end();
    });
}
exports.uploadData = uploadData;
