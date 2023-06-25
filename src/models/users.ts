import mongoose from "mongoose";
import { Schema } from "mongoose";

// 사용자 스키마
const userSchema = new Schema({
    email: String,
    password: String,
    username: String,
    createdAt: Date,
    updatedAt: Date,
    active: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema);

export default User;
