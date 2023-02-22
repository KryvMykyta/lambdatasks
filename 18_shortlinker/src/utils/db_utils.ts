import { Batch, MongoClient } from "mongodb";
import { Request, Response } from "express";
import crypto from "crypto";

require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dep6w4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

const BASE_URL = process.env.BASE_URL || "http://localhost:3000/";

function createShortLink(link: string) {
  const shortedLink = `${link}${crypto.randomBytes(8).toString("hex")}`;
  return shortedLink;
}

export async function uploadData(link: string) {
  try {
    await client.connect();
    const data = client.db(process.env.DB_NAME).collection("routes");
    const foundData = await data.findOne({ link: link })
    if (!foundData) {
      const shortedLink = createShortLink(BASE_URL);
      await data.insertOne({
        link: link,
        shorted_link: shortedLink,
      });
      client.close();
    return {
      status: 200,
      message: "success",
      shortened_link: shortedLink,
    };
    }
    client.close();
    return {
      status: 400,
      message: "Link was already shortened",
      shortened_link: foundData.shorted_link,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Server error",
      shortened_link: "",
    };
  }
}

export async function getData(route: string) {
  const shortedLink = `${BASE_URL}${route}`;
  try {
    await client.connect();
    const data = client.db(process.env.DB_NAME).collection("routes");
    const content = await data.findOne({ shorted_link: shortedLink });
    if (!content) {
      client.close();
      return {
        status: 404,
        message: "Data wasnt found",
        shortened_link: "",
      };
    }
    client.close();
    return {
      status: 200,
      message: "success",
      shortened_link: content.link,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Server error",
      shortened_link: "",
    };
  }
}
