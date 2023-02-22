const express = require("express");
const { login, signUp, refresh, getMe, authVerify } = require("./controllers/authControllers");


const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/me:num", authVerify, getMe);

app.post("/refresh", refresh);

app.post("/signup", signUp);

app.post("/login", login);

app.listen(PORT, () => {
  console.log("started");
});
