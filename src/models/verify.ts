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
export const EmailToken = mongoose.model("EmailToken", emailTokenSchema);
