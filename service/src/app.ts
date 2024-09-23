import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { createRouter } from "./routes/create";
import { updateRouter } from "./routes/update";
import { errorHandler, NotFoundError } from "@ebazdev/core";
import cookieSession from "cookie-session";
import * as dotenv from "dotenv";
import { getRouter } from "./routes/get";
import { listRouter } from "./routes/list";
import { branchesRouter } from "./routes/branches";
dotenv.config();

const apiPrefix = "/api/v1/customer";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: true,
    secure: process.env.NODE_ENV !== "test",
    keys: [process.env.JWT_KEY!],
  })
);

app.use(apiPrefix, createRouter);
app.use(apiPrefix, updateRouter);
app.use(apiPrefix, getRouter);
app.use(apiPrefix, listRouter);
app.use(apiPrefix, branchesRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
