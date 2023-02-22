import express from "express";
import { getCountryByIp } from "./utils/getInfo.js";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  try {
    if (req.query.ip) {
      const ip = JSON.stringify(req.query.ip).replaceAll(`"`, "");
      const country = getCountryByIp(ip);
      return res
        .status(200)
        .send({ ip: ip, country: country.replace(`\r`, "") });
    }
    const ip = req.headers["x-forwarded-for"];
    const country = getCountryByIp(ip.toString());
    return res.status(200).send({ ip: ip, country: country.replace(`\r`, "") });
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log("started");
});
