import express from "express";
// import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/database.js";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(cors());

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(express.static("public"));

import Router from "./src/routes/main.routes.js";

app.get("/", (req, res) => {
  res.send("server is live ");
});

app.use("/api", Router);

app.listen(43434, async (e) => {
  if (e) {
    console.log(e);
    return process.exit(1);
  }
  await connectDB();
  console.log("Server is running and connected to database");
});
