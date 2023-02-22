const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../Errors/ApiError");

require("dotenv").config();

// const uri = `mongodb://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.0dep6w4.mongodb.net/${process.env.DBNAME}?maxPoolSize=2-&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dep6w4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function createUser(email, pass) {
  try {
    await client.connect();
    console.log("connected");
    const users = client.db("authorization").collection("users");
    const user = await users.findOne({ email: email });
    if (user) throw new ApiError(400, "User already exist");
    await users.insertOne({
      email: email,
      pass: pass,
    });
    client.close();
    return {
      status: 200,
      message: "User succesfully created",
    };
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError)
      return {
        status: err.status,
        message: err.message,
      };
    return {
      status: 500,
      message: "server error",
    };
  }
}

async function getUserByEmail(email) {
  await client.connect();
  const users = client.db("authorization").collection("users");
  const user = await users.findOne({ email: email });
  client.close();
  return user; // null or user:{}
}

async function getUserById(id) {
  await client.connect();
  const users = client.db("authorization").collection("users");
  const user = await users.findOne({ _id: new ObjectId(id) });
  client.close();
  return user; // null or user:{}
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
