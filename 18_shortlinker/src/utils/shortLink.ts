import crypto from "crypto";
import dotenv from 'dotenv'
dotenv.config()

const BASE_URL = process.env.BASE_URL || "localhost:3000/";

export class ShortLinkUtils {
  public createShortLink = () => {
    const shortedLink = `${BASE_URL}${crypto.randomBytes(8).toString("hex")}`;
    return shortedLink;
  };
}
