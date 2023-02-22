import express from "express";
import { getLinkController, uploadController } from "./controllers/controllers";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/shortit", uploadController);

app.get("/:link", getLinkController);

app.listen(PORT, () => {
  console.log("started");
});
