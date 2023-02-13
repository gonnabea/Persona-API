import express from "express";
import logger from "morgan";
import * as path from "path";
import mongoose from "mongoose";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import { index } from "./routes/index";
import { authRouter } from "./routes/authRouter";

// Swagger
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./swagger";

// Create Express server
export const app = express();

const { MONGO_URL } = process.env;

export const mongooseConnection = mongoose.connect(MONGO_URL);

// Express configuration
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", index);
app.use("/auth", authRouter);

// swagger serve
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true }),
);

app.use(errorNotFoundHandler);
app.use(errorHandler);
