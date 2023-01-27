// import { getDeadline, getPrice, getTime} from "./getdate.js";
// import express from 'express';
const express = require('express')
const info = require('./getdate.js')


const app = express()

const PORT = 3000
app.use(express.json())

app.post('/', (req,res) => {
    console.log(req.body)
    let data = req.body
    let cost = info.getPrice(data)
    let time = info.getTime(data)
    let date = info.getDeadline(new Date(),time*3600*1000)
    let result = {
        "price": cost,
        "time": time,
        "deadline":date.getTime(),
        "deadline_date":date.toString()
    }
    res.send(result)
})

app.listen(PORT, () => {
    console.log("started")
})