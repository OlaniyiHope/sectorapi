// following is the es modules declaration style in nodejs
import express from "express";

import sectorRoute from "./routes/sectorRoute.js";
import authRoute from "./routes/authRoute.js";

import dotenv from "dotenv";
import connectDB from "./config/db2.js";
import cors from "cors";
dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/", sectorRoute);
app.use("/api/", authRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
