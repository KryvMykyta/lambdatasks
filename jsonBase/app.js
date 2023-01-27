const express = require('express')
const utilites = require('./utils.js')

const DBNAME = "data.json"

const app = express()

const PORT = 3000
app.use(express.json())

app.post('/:id', (req,res) => {
    let content = req.body
    let data = utilites.getData(DBNAME)
    let key = req.params.id
    let obj = {}
    obj[key] = content
    data = Object.assign(data,obj)
    utilites.loadData(DBNAME,data)
    res.send("loaded")
})

app.get('/:id', (req,res) => {
    let route = req.params.id
    console.log(route.toString())
    let data = utilites.getByRoute(route.toString(), DBNAME)
    console.log(data)
    if (data === undefined){
        res.send({"error":"No data at this endpoint"})
    }
    else {
        res.send(utilites.getByRoute(route.toString(), DBNAME))
    }
    
})

app.listen(PORT, () => {
    console.log("started")
})