import { infoRouter } from './routers/infoRouter';
import { ListingsRepository } from './repository/ListingsRepository';
import express from "express";
import cron from "node-cron";
import dotenv from 'dotenv'
dotenv.config();
const CONN_STRING = String(process.env.DB_CONN_STRING)

// const repository = new ListingsRepository(CONN_STRING)
// cron.schedule("*/5 * * * *", repository.updateDB);

const app = express();

const PORT = 3000;
app.use(express.json());

app.use("/", infoRouter);

app.listen(PORT, () => {
  console.log("started");
});
