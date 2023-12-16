import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";


config({
    path: './config/config.env',
});

const app = express();

//USING MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cookieParser());

//IMPORTING & USING ROUTES

import course from './routes/courseRoutes.js';
import user from './routes/userRoutes.js';
import ErrorMiddleware from "./middlewares/Error.js";
import payment from './routes/paymentRoutes.js';
import other from './routes/otherRoutes.js';


app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", payment);
app.use("/api/v1", other);

export default app;


app.use(ErrorMiddleware);