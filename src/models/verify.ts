import mongoose from "mongoose";
import { Schema } from "mongoose";

// 이메일 인증 토큰 스키마
const emailTokenSchema = new Schema(
    {
        email: String,
        token: String,
        expiresAt: { type: Date, expires: "24h", default: Date.now },
    },
    { versionKey: false },
);

export const EmailToken = mongoose.model("EmailToken", emailTokenSchema);
