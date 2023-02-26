import { getData, uploadData } from "../utils/db_utils";
import { Request, Response } from "express";

export const uploadController = async (
  req: Request<{ link: string }>,
  res: Response
) => {
  const {
    body: { link },
  } = req;

  const responseData = await uploadData(link);

  return res.status(responseData.status).send(responseData);
}

export const getLinkController = async (
  req: Request<{ link: string }>,
  res: Response
) => {
  const {
    params: { link: route },
  } = req;

  const responseData = await getData(route);

  return res.status(responseData.status).send(responseData);
}
