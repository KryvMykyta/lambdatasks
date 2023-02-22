const { createUser } = require("../utils/dbutils");
const { loginUser, refreshToken } = require("../utils/tokens");

function signUp(req, res) {
  const { email, pass } = req.body;
  const { status, message } = createUser(email, pass);
  return res.status(status).send(message);
}

async function login(req, res) {
  const { email, pass } = req.body;
  const loginResponse = await loginUser(email, pass);
  return res.status(loginResponse.status).send(loginResponse);
}

async function refresh(req, res) {
  const { email, pass } = req.body;
  const refreshResponse = await refreshToken(email, pass);
  return res.status(refreshResponse.status).send(refreshResponse);
}

function getMe(req, res) {
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

function authVerify(req, res) {
  const {headers: {authorization: bearer_token}} = req
  if (!bearer_token) {
    return res.status(401).send("Token not provided");
  }
  const token = bearer_token.split(" ")[1];
  try {
    req.user = jwt.verify(token, secretKey);
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
