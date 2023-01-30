const { MongoClient, ServerApiVersion} = require('mongodb');
const jwt = require('jsonwebtoken')

require('dotenv').config()

// const uri = `mongodb://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.0dep6w4.mongodb.net/${process.env.DBNAME}?maxPoolSize=2-&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dep6w4.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function createUser(req,res){
    const {email,pass} = req.body
    try{
        await client.connect()
        console.log("connected")
        const users = client.db("authorization").collection("users")
        console.log(await users.findOne({"email":email}))
        try{
            const refreshToken = jwt.sign({
                "email": email,
                "pass": pass,
                "type": "refresh"
            }, process.env.SECRET);
            console.log(refreshToken)
            await users.insertOne({
                "email":email,
                "pass":pass,
                "refreshToken":refreshToken
            })
            client.close()
            return res.status(200).send("User succesfully created")
        } catch(err){
            client.close()
            return res.status(400).send("User already exist")
        }
        
    } catch (err) {
        return res.status(500).send("server error")
    }
}


async function getUser(email){
    try{
        await client.connect()
        const users = client.db("authorization").collection("users")
        let user = await users.findOne({"email":email})
        client.close()
        return user // null or user:{}
    } catch (err) {
        console.log(err)
    }
}



module.exports = {
    createUser,
    getUser
}

