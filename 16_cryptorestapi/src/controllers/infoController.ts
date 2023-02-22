import { Request, Response } from "express";
import { getReplyInfo } from "../utils/createReply";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export async function getInfo(
  req: Request<
    {},
    {},
    {},
    { time?: number; currency?: string; market?: string }
  >,
  res: Response
) {
  const { time, currency, market } = req.query;
  return res.status(200).send(getReplyInfo(time, currency, market));
}
