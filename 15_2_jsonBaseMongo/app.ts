import express from 'express'
import {loadData, getData} from './dbutils.js'

const app = express()
const PORT = 3000

app.use(express.json())

app.post('/:path', loadData)

app.get('/:path',getData)


app.listen(PORT, () => {
    console.log("started")
})