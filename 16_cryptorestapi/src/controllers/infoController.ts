import { Request, Response } from "express";
import { getReplyInfo } from "../utils/createReply";
import dotenv from "dotenv";
import { markets } from "../schemas/schemas";
dotenv.config({ path: "../.env" });



export async function getInfo(
  req: Request<
    {},
    {},
    {},
    { time?: number; currency?: string; market?: markets}
  >,
  res: Response
) {
  const { time, currency, market } = req.query;
  return res.status(200).send(await getReplyInfo(time, currency, market));
}
