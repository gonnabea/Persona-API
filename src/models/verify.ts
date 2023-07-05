import mongoose from "mongoose";
import { Schema } from "mongoose";

// 이메일 인증 토큰 스키마
const emailTokenSchema = new Schema(
    {
        email: String,
        token: String,
    },
    { timestamps: true },
);
emailTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// 비밀번호 찾기 토큰 스키마
const resetPasswordTokenSchema = new Schema(
    {
        email: String,
        token: String,
    },
    { timestamps: true },
);
resetPasswordTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const EmailToken = mongoose.model("EmailToken", emailTokenSchema);
export const ResetPasswordToken = mongoose.model(
    "ResetPasswordToken",
    resetPasswordTokenSchema,
);
