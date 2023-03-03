import { Request, Response } from "express";
import { markets } from "../schemas/schemas";
import { ResponseGenerator } from ".././utils/responseGenerator";

export const getInfo = async (
  req: Request<
    {},
    {},
    {},
    { time?: number; currency?: string; market?: markets}
  >,
  res: Response
) => {
  const { time, currency, market } = req.query;
  try{
    const responseGenerator = new ResponseGenerator()
    return res.status(200).send(await responseGenerator.getResponse(time, currency, market));
  }
  catch(err) {
    console.log(err)
    return res.status(500).send("Something went wrong");
  }
}
