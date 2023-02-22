import express from "express";
import cron from "node-cron";
import { getInfo } from "./controllers/infoController";
import { uploadData, createDB, createTable } from "./utils/updateDB";
createDB();
createTable();

cron.schedule("*/1 * * * *", uploadData);

const app = express();

const PORT = 3000;
app.use(express.json());

app.get("/", getInfo);

app.listen(PORT, () => {
  console.log("started");
});