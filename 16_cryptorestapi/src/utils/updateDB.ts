import { getAllData } from "./getCoins";
import mysql from "mysql2";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export function createDB() {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  connection.connect(function (err) {
    if (err) throw err;
  });
  connection.query(
    "CREATE DATABASE IF NOT EXISTS crypto",
    function (err, result) {
      if (err) throw err;
      console.log("Database created");
    }
  );
  connection.end();
}

export function createTable() {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: "crypto",
    password: process.env.DB_PASS,
  });
  connection.connect(function (err) {
    if (err) throw err;
  });
  const sql = [
    "CREATE TABLE IF NOT EXISTS exchanges (",
    "currency VARCHAR(255) CHARACTER SET utf8mb4,",
    "kucoin VARCHAR(255) CHARACTER SET utf8mb4,",
    "coinStats VARCHAR(255) CHARACTER SET utf8mb4,",
    "coinBase VARCHAR(255) CHARACTER SET utf8mb4,",
    "coinPaprika VARCHAR(255) CHARACTER SET utf8mb4,",
    "time BIGINT",
    ")",
  ].join("\n");

  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
  connection.end();
}

export async function uploadData() {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: "crypto",
    password: process.env.DB_PASS,
  });
  console.log("updating");

  connection.connect(function (err) {
    if (err) console.log(err);
  });
  console.log("connected");
  const time = new Date().getTime();
  const currenciesRates = await getAllData();

  const uploadingData: Array<Array<string | number>> = [];
  const currencies = Object.keys(currenciesRates);
  currencies.forEach((currency) => {
    const markets = currenciesRates[currency];
    const prices = [
      currency,
      markets.kucoinPrice,
      markets.coinStatsPrice,
      markets.coinBasePrice,
      markets.paprikaPrice,
      time,
    ];
    uploadingData.push(prices);
  });
  console.log("loading: \n", uploadingData);
  let sql = `INSERT INTO exchanges (currency, kucoin, coinStats, coinBase, coinPaprika, time) VALUES ?`;
  connection.query(sql, [uploadingData], function (err, result) {
    if (err) throw err;
  });
  connection.end();
}
