import { Router } from "express";
import {
    createAccount,
    login,
    resetPassword,
} from "../controllers/authController";

export const authRouter = Router();

authRouter.post("/sign-in", login);
authRouter.post("/sign-up", createAccount);
authRouter.post("/reset-password", resetPassword);
