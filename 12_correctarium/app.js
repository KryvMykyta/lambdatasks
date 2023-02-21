const express = require('express')
const {getOrderDetails} = require('./utils/getdate.js')


const app = express()

const PORT = 3000
app.use(express.json())

app.post('/', (req,res) => {
    const {body} = req
    res.send(getOrderDetails(body))
})

app.listen(PORT, () => {
    console.log("started")
})