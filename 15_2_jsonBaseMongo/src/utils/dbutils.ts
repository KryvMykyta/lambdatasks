import { MongoClient, ServerApiVersion} from 'mongodb'
import {Request, Response } from 'express'

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dep6w4.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri);


// const data = client.db("jsonbase").collection("data")

export async function loadData(req: Request, res: Response){
    const {body} = req
    const {path} = req.params
    try{ 
        await client.connect()
        const data = client.db("jsonbase").collection("data")
        if (!await data.findOne({"path": path})){
            await data.insertOne({
                "path": path,
                "data": body
            })
            client.close()
            return res.status(200).send("Data was succesfully written")
        }
        else {
            client.close()
            return res.status(400).send("Route already taken")
        }
    } catch(err) {
        return res.status(500).send("Server error")
    }
}


export async function getData(req: Request, res: Response) {
    const {path} = req.params
    try{
        await client.connect()
        const data = client.db("jsonbase").collection("data")
        const content = await data.findOne({"path": path})
        if (!content){
            client.close()
            return res.status(404).send("Data wasnt found")
        }
        else { 
            client.close()
            return res.status(200).send(content.data)
        }
    } catch(err) {
        return res.status(500).send("Server error")
    }
}


