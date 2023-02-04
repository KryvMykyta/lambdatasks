import { MongoClient} from 'mongodb'
import {Request, Response } from 'express'
import crypto from 'crypto';

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dep6w4.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri);


// const data = client.db("jsonbase").collection("data")

export async function loadData(req: Request, res: Response){
    const link : string = req.body.link
    const shortedLink = "localhost:3000/"+ crypto.randomBytes(8).toString('hex')
    try{ 
        await client.connect()
        const data = client.db(process.env.DB_NAME).collection("routes")
        if (await data.findOne({"link": link}) === null ){
            await data.insertOne({
                "link": link,
                "shorted_link": shortedLink
            })
            client.close()
            return res.status(200).send({
                "shorted_link": shortedLink
            })
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
    const shortedLink = "localhost:3000/"+req.params.link
    console.log(req.params)
    try{
        await client.connect()
        const data = client.db(process.env.DB_NAME).collection("routes")
        let content = await data.findOne({"shorted_link": shortedLink})
        if (content === null ){
            client.close()
            return res.status(404).send("Data wasnt found")
        }
        else { 
            client.close()
            return res.status(200).send({link: content["link"]})
        }
    } catch(err) {
        return res.status(500).send("Server error")
    }
}


