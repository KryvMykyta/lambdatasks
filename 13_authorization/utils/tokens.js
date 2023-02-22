const jwt = require("jsonwebtoken");
const { ApiError } = require("../Errors/ApiError.js");
const { getUserByEmail, getUserById } = require("./dbutils.js");
require("dotenv").config();

const secretKey = process.env.SECRET;

async function loginUser(email, pass) {
  try {
    const userCredentials = await getUserByEmail(email);

    if (
      userCredentials === null ||
      email !== userCredentials.email ||
      pass !== userCredentials.pass
    ) {
      return {
        status: 406,
        message: "Invalid credentials",
        accessToken: "",
        refreshToken: "",
      };
    }
    const expiresAccess = Math.round(Math.random() * (60 - 30) + 30);
    const accessToken = jwt.sign({ email: userCredentials.email }, secretKey, {
      expiresIn: `${expiresAccess}s`,
    });

    const refreshToken = jwt.sign({ _id: userCredentials["_id"] }, secretKey, {
      expiresIn: `1d`,
    });

    return {
      status: 200,
      message: "success",
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: "server error",
      accessToken: "",
      refreshToken: "",
    };
  }
}

async function refreshToken(req, res) {
  const body = req.headers.authorization;
  console.log(req.headers);
  if (!body) {
    return {
      status: 400,
      message: "Token not provided",
      accessToken: "",
      refreshToken: "",
    };
  }
  const oldRefreshToken = body.split(" ")[1];
  try {
    const decoded = jwt.verify(oldRefreshToken, secretKey);
    const user = await getUserById(decoded["_id"]);
    console.log(user);
    if (!user) throw new ApiError(401, "Unauthorized");
    const info = { email: user.email };
    const expires = Math.round(Math.random() * (60 - 30) + 30);
    const accessToken = jwt.sign(info, secretKey, {
      expiresIn: `${expires}s`,
    });
    const refreshToken = jwt.sign({ _id: user["_id"] }, secretKey, {
      expiresIn: `1d`,
    });
    return {
      status: 200,
      message: "success",
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (err) {
    console.log(err.message);
    if (err instanceof ApiError)
      return {
        status: err.status,
        message: err.message,
        accessToken: "",
        refreshToken: "",
      };
  }
}

module.exports = {
  loginUser,
  refreshToken,
};
