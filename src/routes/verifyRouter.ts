import { Router } from "express";
import { verifyEmail } from "../controllers/verifyController";
import { createEmailVerifyToken } from "../controllers/verifyController";

export const verifyRouter = Router();

// 이메일 인증 //
// 이메일 토큰 생성
verifyRouter.post("/email", createEmailVerifyToken);
// 이메일 토큰 검증
verifyRouter.get("/email", verifyEmail);
