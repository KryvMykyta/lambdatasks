const { createUser } = require("../utils/dbutils");
const jwt = require("jsonwebtoken");
const { loginUser, refreshToken } = require("../utils/tokens");
require("dotenv").config();
const secretKey = process.env.SECRET;

const signUp = async (req, res) => {
  const { email, pass } = req.body;
  const { status, message } = await createUser(email, pass);
  console.log(status,message)
  return res.status(status).send(message);
}
const login = async (req, res) => {
  const { email, pass } = req.body;
  const loginResponse = await loginUser(email, pass);
  return res.status(loginResponse.status).send(loginResponse);
}

const refresh = async (req, res) => {
  const {headers: {authorization: bearer_token}} = req
  const oldRefreshToken = bearer_token.split(" ")[1]
  const refreshResponse = await refreshToken(oldRefreshToken);
  console.log(refreshResponse)
  return res.status(refreshResponse.status).send(refreshResponse);
}

const getMe = (req, res) => {
  const {
    params: { num },
    user: { email },
  } = req;
  const response = {
    request_num: num,
    data: {
      email: email,
    },
  };
  return res.status(200).send(response);
}

const authVerify = (req, res, next) => {
  const {headers: {authorization: bearer_token}} = req
  if (!bearer_token) {
    return res.status(401).send("Token not provided");
  }
  const token = bearer_token.split(" ")[1];
  try {
    req.user = jwt.verify(token, secretKey);
    console.log(req.user)
    if (!req.user.email) throw new ApiError(401, "Expired or invalid token");
  } catch (err) {
    console.log(err.message);
    if (err instanceof ApiError)
      return res.status(err.status).send(err.message);
    return res.status(401).send("Expired or invalid token");
  }
  next();
}

module.exports = {
  login,
  signUp,
  refresh,
  authVerify,
  getMe
};
