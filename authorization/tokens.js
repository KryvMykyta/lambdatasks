const jwt = require('jsonwebtoken')
const {getUser} = require('./dbutils.js')
require('dotenv').config()

const secretKey = process.env.SECRET

async function generateAccessTokenLogin(req,res){
    const {email,pass} = req.body
    const info = {
        "email": email,
        "pass": pass
    }
    try{
        const userCredentials = await getUser(email)
        
        if (userCredentials === null || (email !== userCredentials.email || pass !== userCredentials.pass)) {
            res.send(406).send("Invalid credentials")
        }
        else{
            let expires = Math.round(Math.random() * (60 - 30) + 30);
            const accessToken = jwt.sign(info, secretKey, {
                expiresIn: `${expires}s`
            });
    
            return res.status(200).json({ accessToken });
        }
    } catch(err) {
        return res.status(500).send("server error")
    }   
}

async function refreshToken(req,res){
    let body = req.headers.authorization
    console.log(req.headers)
    if (!body) {
        res.status(401).send("Token not provided")
    }
    let refresh = body.split(" ")[1]
    try{
        try {
            const decoded = jwt.verify(refresh, secretKey)
            const info = {
                "email":decoded["email"],
                "pass":decoded["pass"]
            }
            try {
                const user = await getUser(info["email"])
                if (user["refreshToken"] === refresh){
                    let expires = Math.round(Math.random() * (60 - 30) + 30);
                    const accessToken = jwt.sign(info, secretKey, {
                        expiresIn: `${expires}s`
                    });
                    return res.status(200).json({ accessToken });
                }
                else {
                    return res.status(401).send("unauthorized")
                }
            } catch(err){
                return res.status(500).send("server error")
            }
        } catch (error) {
            if (err instanceof jwt.JsonWebTokenError){
                res.send(401).send("Invalid token")
            }  
        }
        
    }catch (err) {
        return res.status(401).send("unauthorized")
    }

}

function authVerify(req,res,next){
    let body = req.headers.authorization
    if (!body) {
        return res.status(401).send("Token not provided")
    }
    let token = body.split(" ")[1]
    try {
        jwt.verify(token,secretKey)
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError){
            return res.status(401).send("Invalid token")
        }    
    }
    next()
}

async function getMe(req,res) {
    let body = req.headers.authorization
    const request_num = req.params.num
    try {
        let token = body.split(" ")[1]
        try{
            const decoded = jwt.verify(token,process.env.SECRET)
            try{
                const user = await getUser(decoded["email"])
                let response = {
                    "request_num": request_num,
                    "data": {
                        "email": user["email"]
                    }
                }
                return res.status(200).send(response)
            } catch(err) {
                return res.status(500).send("server error")
            }
        } catch(err) {
            return res.status(401).send("unauthorized")
        }
    } catch (err){
        return res.status(401).send("unauthorized")
    }
    
}

module.exports = {
    generateAccessTokenLogin,
    refreshToken,
    authVerify,
    getMe
}
