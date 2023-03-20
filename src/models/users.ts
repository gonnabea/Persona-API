/**
*  @swagger
*  tags:
*    name: Books
*    description: API to manage your books.
*/
/**
*  @swagger
*  paths:
*   /books:
*     get:
*       summary: Lists all the books
*       tags: [Books]
*       responses:
*         "200":
*           description: The list of books.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Book'
*     post:
*       summary: Creates a new book
*       tags: [Books]
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Book'
*       responses:
*         "200":
*           description: The created book.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Book'
*/

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
