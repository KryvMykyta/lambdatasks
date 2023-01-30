const express = require('express')
const {createUser} = require('./dbutils.js')
const {generateAccessTokenLogin, refreshToken,getMe, authVerify} = require('./tokens.js')

const app = express()
const PORT = 3000
app.use(express.json())

app.get('/me:num', authVerify, getMe)

app.post('/refresh', refreshToken)

app.post('/signup', createUser)

app.post('/login', generateAccessTokenLogin)

app.listen(PORT, () => {
    console.log("started")
})