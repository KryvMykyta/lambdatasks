import { ListingsRepository } from '../repository/ListingsRepository';
import express, { Router } from "express";
import cron from "node-cron";
import { getInfo } from "../controllers/infoController";

export const infoRouter = Router();

infoRouter.get("/", getInfo);

