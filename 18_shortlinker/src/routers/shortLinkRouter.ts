import { shortLinkController } from './../controllers/shortLinkController';
import { Router } from "express";

export const shortLinkRouter = Router();

shortLinkRouter.post("/shortit", new shortLinkController().uploadController);

shortLinkRouter.get("/:link", new shortLinkController().getLinkController);
