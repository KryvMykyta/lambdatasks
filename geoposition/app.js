import express from "express";
import { getCountryByIp } from "./getInfo.js";

const app = express()
const PORT = 3000
app.use(express.json())

app.get('/', (req,res) => {
    if (req.query.ip !== undefined){
        let ip = JSON.stringify(req.query.ip).replaceAll(`"`,"")
        let country = getCountryByIp(ip)
        res.send({"ip": ip, "country":country.replace(`\r`,"")})
    }
    else {
        let ip = req.headers['x-forwarded-for']
        console.log(ip.toString())
        let country = getCountryByIp(ip.toString())
        res.send({"ip": ip, "country":country.replace(`\r`,"")})
    }
})

app.listen(PORT, () => {
    console.log("started")
})