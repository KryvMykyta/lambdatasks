import express from 'express'
import cron from 'node-cron'
import { getInfo } from './controllers/infoController'
import { uploadData } from './dbutils/updateDB'

cron.schedule('*/5 * * * *', uploadData);

const app = express()

const PORT = 3000
app.use(express.json())

app.get('/', getInfo)

app.listen(PORT, () => {
    console.log("started")
})