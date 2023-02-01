import { getAllData } from "../getApisData/getAllData";
import mysql from 'mysql'
import * as dotenv from 'dotenv'
dotenv.config({path:"../.env"})

/* Update data
    "INSERT INTO Exchanges (Currency, Kucoin, Paprika, CoinBase, CoinStats, Time) VALUES (CurrencyName, KucoinPrice, PaprikaPrice, CoinBasePrice, CoinStatsPrice, Time)";
*/


function createDB(){
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
    connection.query("CREATE DATABASE IF NOT EXISTS crypto", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
    connection.end()
}

function createTable(){
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.DB_USER,
        database:"crypto",
        password: process.env.DB_PASS
    });
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
    const sql = [
        "CREATE TABLE IF NOT EXISTS exchanges (",
        "currency VARCHAR(255) CHARACTER SET utf8mb4,",
        "kucoin VARCHAR(255) CHARACTER SET utf8mb4,",
        "coinStats VARCHAR(255) CHARACTER SET utf8mb4,",
        "coinBase VARCHAR(255) CHARACTER SET utf8mb4,",
        "coinMarketCap VARCHAR(255) CHARACTER SET utf8mb4,",
        "coinPaprika VARCHAR(255) CHARACTER SET utf8mb4,",
        "time BIGINT",
        ")"
    ].join("\n");
    
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
    connection.end()
}


export async function uploadData() {
    createDB()
    createTable()

    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.DB_USER,
        database:"crypto",
        password: process.env.DB_PASS
    });

    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    const time = new Date().getTime()
    const data = await getAllData()
    let loadingData = []
    let currencies = Object.keys(data)
    for (let currency of currencies){
        let markets = data[currency]
        let prices = [currency, markets["kucoinPrice"], markets["coinStatsPrice"], markets["coinBasePrice"], markets["marketCapPrice"], markets["paprikaPrice"], time]
        loadingData.push(prices)
    }
    let sql = `INSERT INTO exchanges (currency, kucoin, coinStats, coinBase, coinMarketCap, coinPaprika, time) VALUES ?`
    connection.query(sql, [loadingData], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    connection.end()
}