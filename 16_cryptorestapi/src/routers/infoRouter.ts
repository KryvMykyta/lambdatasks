import { Router } from "express";
import { getInfo } from "../controllers/infoController";

export const infoRouter = Router();

infoRouter.get("/", getInfo);

