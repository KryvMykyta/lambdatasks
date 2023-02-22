const express = require("express");
const { createUser } = require("./dbutils.js");
const { loginUser, refresh, getMe, authVerify } = require("./tokens.js");

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/me:num", authVerify, getMe);

app.post("/refresh", refresh);

app.post("/signup", createUser);

app.post("/login", loginUser);

app.listen(PORT, () => {
  console.log("started");
});
