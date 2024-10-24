import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { createRouter } from "./routes/create";
import { updateRouter } from "./routes/update";
import { currentUser, errorHandler, NotFoundError } from "@ebazdev/core";
import cookieSession from "cookie-session";
import * as dotenv from "dotenv";
import { getRouter } from "./routes/get";
import { listRouter } from "./routes/list";
import { branchesRouter } from "./routes/branches";
import { categoryCreateRouter } from "./routes/category-create";
import { categoryListRouter } from "./routes/category-list";
import { categoryGetRouter } from "./routes/category-get";
import { healthRouter } from "./routes/health";
import cors from "cors";
import { supplierCodeSaveRouter } from "./routes/supplier-code-save";
import { locCreateRouter } from "./routes/location-create";
import { locationListRouter } from "./routes/location-list";
import { merchantCreateRouter } from "./routes/merchant-create";
import { boListRouter } from "./routes/backoffice/list";
import { merchantConfirmByHolding } from "./routes/merchant-confirm-by-holding";
import { customerHoldingCreateRouter } from "./routes/create-bulk-customer-holding";
import { holdingLoginRouter } from "./routes/holding-login";
import { holdingSigninRouter } from "./routes/merchant-holding-signin";
import { holdingListRouter } from "./routes/holding-list";
dotenv.config();

const apiPrefix = "/api/v1/customer";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true, // Allow credentials (cookies, etc.)
  })
);
app.use(
  cookieSession({
    signed: true,
    secure: process.env.NODE_ENV !== "test",
    keys: [process.env.JWT_KEY!],
  })
);

app.use(currentUser);
app.use(apiPrefix, createRouter);
app.use(apiPrefix, updateRouter);
app.use(apiPrefix, getRouter);
app.use(apiPrefix, listRouter);
app.use(apiPrefix, branchesRouter);
app.use(apiPrefix, categoryCreateRouter);
app.use(apiPrefix, categoryListRouter);
app.use(apiPrefix, categoryGetRouter);
app.use(apiPrefix, supplierCodeSaveRouter);
app.use(apiPrefix, locCreateRouter);
app.use(apiPrefix, locationListRouter);
app.use(apiPrefix, healthRouter);
app.use(apiPrefix, merchantCreateRouter);
app.use(apiPrefix, boListRouter);
app.use(apiPrefix, merchantConfirmByHolding);
app.use(apiPrefix, customerHoldingCreateRouter);
app.use(apiPrefix, holdingLoginRouter);
app.use(apiPrefix, holdingSigninRouter);
app.use(apiPrefix, holdingListRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
