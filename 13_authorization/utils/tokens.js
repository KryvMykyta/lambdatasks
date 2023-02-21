const jwt = require('jsonwebtoken')
const { ApiError } = require('../Errors/ApiError.js')
const {getUserByEmail, getUserById} = require('./dbutils.js')
require('dotenv').config()

const secretKey = process.env.SECRET

async function loginUser(req,res){
    const {email,pass} = req.body
    try{
        const userCredentials = await getUserByEmail(email)
        
        if (userCredentials === null || (email !== userCredentials.email || pass !== userCredentials.pass)) {
            res.status(406).send("Invalid credentials")
        }
        else{
            const expiresAccess = Math.round(Math.random() * (60 - 30) + 30);
            const accessToken = jwt.sign({"email":userCredentials.email}, secretKey, {
                expiresIn: `${expiresAccess}s`
            });

            const refreshToken = jwt.sign({"_id":userCredentials["_id"]}, secretKey, {
                expiresIn: `1d`
            });
            
            return res.status(200).json({accessToken, refreshToken});
        }
    } catch(err) {
        console.log(err)
        return res.status(500).send("server error")
    }   
}

async function refresh(req,res){
    const body = req.headers.authorization
    console.log(req.headers)
    if (!body) {
        return res.status(400).send("Token not provided")
    }
    const oldRefreshToken = body.split(" ")[1]
    try {
        const decoded = jwt.verify(oldRefreshToken, secretKey)
        const user = await getUserById(decoded["_id"])
        console.log(user)
        if (!user) throw new ApiError(401, "Unauthorized")
        const info = {"email":user.email}
        const expires = Math.round(Math.random() * (60 - 30) + 30);
        const accessToken = jwt.sign(info, secretKey, {
            expiresIn: `${expires}s`
        });
        const refreshToken = jwt.sign({"_id":user["_id"]}, secretKey, {
            expiresIn: `1d`
        });
        return res.status(200).send({accessToken, refreshToken});
    } catch (err) {
        console.log(err.message)
        if (err instanceof ApiError) return res.status(err.status).send(err.message)
        
    }
}

function authVerify(req,res,next){
    const body = req.headers.authorization
    if (!body) {
        return res.status(401).send("Token not provided")
    }
    const token = body.split(" ")[1]
    try {
        req.user = jwt.verify(token,secretKey)
        if (!req.user.email) throw new ApiError(401,"Expired or invalid token")
    } catch (err) {
        console.log(err.message)
        if (err instanceof ApiError) return res.status(err.status).send(err.message)
        return res.status(401).send("Expired or invalid token")
    }
    next()
}

async function getMe(req,res) {
    const request_num = req.params.num
    const response = {
        "request_num": request_num,
        "data": {
            "email": req.user.email
        }
    }
    return res.status(200).send(response)
}

module.exports = {
    loginUser,
    refresh,
    authVerify,
    getMe
}
