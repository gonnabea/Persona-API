

import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    email: String,
    password: String,
    username: String,
    createdAt: Date,
    updatedAt: Date,
});

const User = mongoose.model('User', userSchema);

export default User;
