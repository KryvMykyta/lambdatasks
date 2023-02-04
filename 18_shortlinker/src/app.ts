import express from 'express'
import { getData, loadData } from './utils/db_utils'

const app = express()
const PORT = 3000

app.use(express.json())

app.post('/shortit', loadData)

app.get('/:link', getData)


app.listen(PORT, () => {
    console.log("started")
})