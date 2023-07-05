import { Router } from "express";
import {
    createResetPasswordToken,
    verifyEmail,
} from "../controllers/verifyController";
import { createEmailVerifyToken } from "../controllers/verifyController";

export const verifyRouter = Router();

// 이메일 인증 //
// 이메일 토큰 생성
verifyRouter.post("/email", createEmailVerifyToken);
// 이메일 토큰 검증
verifyRouter.get("/email", verifyEmail);
// 비밀번호 //
// 비밀번호 초기화 토큰 생성
verifyRouter.post("/reset-password", createResetPasswordToken);
