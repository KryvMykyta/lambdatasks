import express from "express";
import { uploadData, getData } from "./utils/dbutils.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/:path", uploadData);

app.get("/:path", getData);

app.listen(PORT, () => {
  console.log("started");
});
