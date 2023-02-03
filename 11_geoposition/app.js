import express from "express";
import { getCountryByIp } from "./getInfo.js";

const app = express()
const PORT = 3000
app.use(express.json())

app.get('/', (req,res) => {
    try{
        if (req.query.ip !== undefined){
            let ip = JSON.stringify(req.query.ip).replaceAll(`"`,"")
            let country = getCountryByIp(ip)
            return res.status(200).send({"ip": ip, "country":country.replace(`\r`,"")})
        }
        let ip = req.headers['x-forwarded-for']
        console.log(ip.toString())
        let country = getCountryByIp(ip.toString())
        return res.status(200).send({"ip": ip, "country":country.replace(`\r`,"")})
    } catch(err) {
        return res.status(500).send("Server error")
    }
})

app.listen(PORT, () => {
    console.log("started")
})