import {Request, Response} from 'express'
import mysql from 'mysql'
import * as dotenv from 'dotenv'
dotenv.config()

export async function getInfo(req: Request, res: Response) {
    console.log(process.env.DB_PASS)
    let params = req.query
    let sql : string = ""
    if (!params.currency) {
        if (!params.time){
            if (!params.market){
                // filter by none
                sql = "SELECT * FROM exchanges"
            }
            else {
                let market = params.market
                // filter by market
                sql = `SELECT currency, ${market}, time FROM exchanges`
            }
        }
        else {
            let time = params.time
            let timeNow = new Date().getTime()
            let timeStart = timeNow - Number(time)
            if (!params.market){
                // filter by time
                sql = `SELECT * FROM exchanges WHERE time > ${timeStart}`
            }
            else {
                let market = params.market
                // filter by market, time
                sql = `SELECT currency, ${market}, time FROM exchanges WHERE time > ${timeStart}`
            }
        }
    }
    else {
        let currency = params.currency
        if (!params.time){
            if (!params.market){
                // filter by currency
                sql = `SELECT * FROM exchanges WHERE currency = '${currency}'`
            }
            else {
                let market = params.market
                // filter by currency,market
                sql = `SELECT currency, ${market}, time FROM exchanges WHERE currency = '${currency}'`
            }
        }
        else {
            let time = params.time
            let timeNow = new Date().getTime()
            let timeStart = timeNow - Number(time)
            if (!params.market){
                // filter by time, currency
                sql = `SELECT * FROM exchanges WHERE currency = '${currency}' AND time > ${timeStart}`
            }
            else {
                let market = params.market
                // filter by market, time, currency
                sql = `SELECT currency, ${market}, time FROM exchanges WHERE currency = '${currency}' AND time > ${timeStart}`
            }
        }
    }
    console.log(sql)
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

    connection.query(sql, function (err : Error, result : Array<{ [key: string] : string | number}>) {
        if (err) throw err;
        let resArray : Array<{ [key: string] : string | number}> = []
        for (let listing of result){
            let keys = Object.keys(listing)
            let sum = 0
            for (let key of keys){
                if (key !== "currency" && key !== "time"){
                    sum += Number(listing[key])
                }
            }
            if (keys.length === 7){
                sum /= 5
            }
            resArray.push({
                "currency": listing["currency"],
                "price": sum,
                "time": listing["time"]
            })
        }
        return res.status(200).send(resArray)
    });
    connection.end()
}
