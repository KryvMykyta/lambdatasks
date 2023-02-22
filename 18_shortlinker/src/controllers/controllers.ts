import { getData, uploadData } from "../utils/db_utils";
import { Request, Response } from "express";

export async function uploadController(
  req: Request<{ link: string }>,
  res: Response
) {
  const {
    body: { link },
  } = req;

  const responseData = await uploadData(link);

  return res.status(responseData.status).send(responseData);
}

export async function getLinkController(
  req: Request<{ link: string }>,
  res: Response
) {
  const {
    params: { link: route },
  } = req;

  const responseData = await getData(route);

  return res.status(responseData.status).send(responseData);
}
