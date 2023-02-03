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
exports.getInfo = void 0;
const mysql_1 = __importDefault(require("mysql"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function getInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(process.env.DB_PASS);
        let params = req.query;
        let sql = "";
        if (!params.currency) {
            if (!params.time) {
                if (!params.market) {
                    // filter by none
                    sql = "SELECT * FROM exchanges";
                }
                else {
                    let market = params.market;
                    // filter by market
                    sql = `SELECT currency, ${market}, time FROM exchanges`;
                }
            }
            else {
                let time = params.time;
                let timeNow = new Date().getTime();
                let timeStart = timeNow - Number(time);
                if (!params.market) {
                    // filter by time
                    sql = `SELECT * FROM exchanges WHERE time > ${timeStart}`;
                }
                else {
                    let market = params.market;
                    // filter by market, time
                    sql = `SELECT currency, ${market}, time FROM exchanges WHERE time > ${timeStart}`;
                }
            }
        }
        else {
            let currency = params.currency;
            if (!params.time) {
                if (!params.market) {
                    // filter by currency
                    sql = `SELECT * FROM exchanges WHERE currency = '${currency}'`;
                }
                else {
                    let market = params.market;
                    // filter by currency,market
                    sql = `SELECT currency, ${market}, time FROM exchanges WHERE currency = '${currency}'`;
                }
            }
            else {
                let time = params.time;
                let timeNow = new Date().getTime();
                let timeStart = timeNow - Number(time);
                if (!params.market) {
                    // filter by time, currency
                    sql = `SELECT * FROM exchanges WHERE currency = '${currency}' AND time > ${timeStart}`;
                }
                else {
                    let market = params.market;
                    // filter by market, time, currency
                    sql = `SELECT currency, ${market}, time FROM exchanges WHERE currency = '${currency}' AND time > ${timeStart}`;
                }
            }
        }
        console.log(sql);
        const connection = mysql_1.default.createConnection({
            host: process.env.HOST,
            user: process.env.DB_USER,
            database: "crypto",
            password: process.env.DB_PASS
        });
        connection.connect(function (err) {
            if (err)
                throw err;
            console.log("Connected!");
        });
        connection.query(sql, function (err, result) {
            if (err)
                throw err;
            let resArray = [];
            for (let listing of result) {
                let keys = Object.keys(listing);
                let sum = 0;
                for (let key of keys) {
                    if (key !== "currency" && key !== "time") {
                        sum += Number(listing[key]);
                    }
                }
                if (keys.length === 7) {
                    sum /= 5;
                }
                resArray.push({
                    "currency": listing["currency"],
                    "price": sum,
                    "time": listing["time"]
                });
            }
            return res.status(200).send(resArray);
        });
        connection.end();
    });
}
exports.getInfo = getInfo;
