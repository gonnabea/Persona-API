import { Router } from "express";
import { createAccount } from "../controllers/authController";

export const authRouter = Router();

authRouter.post("/sign-up", createAccount);
