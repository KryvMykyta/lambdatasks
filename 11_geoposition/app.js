import express from "express";
import { getCountryByIp } from "./utils/getInfo.js";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  const {query: {ip}} = req
  try {
    if (ip) {
      const ip = JSON.stringify(ip).replaceAll(`"`, "");
      const country = getCountryByIp(ip);
      return res
        .status(200)
        .send({ ip: ip, country: country.replace(`\r`, "") });
    }
    const {headers: {'x-forwarder-for': ip}} = req
    const country = getCountryByIp(ip.toString());
    return res.status(200).send({ ip: ip, country: country.replace(`\r`, "") });
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log("started");
});
