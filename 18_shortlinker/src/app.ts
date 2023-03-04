import { shortLinkRouter } from './routers/shortLinkRouter';
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/', shortLinkRouter)

app.listen(PORT, () => {
  console.log("started");
});
