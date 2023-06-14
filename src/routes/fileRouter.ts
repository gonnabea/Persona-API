import { Router } from "express";
import { downloadCharacterFromURL } from "../controllers/fileController";

export const fileRouter = Router();


fileRouter.get("/downloadCharacters", downloadCharacterFromURL);