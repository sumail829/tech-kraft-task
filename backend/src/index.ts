import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const connectWithRetry = async (retries = 10, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await AppDataSource.initialize();
      console.log(" DB connected");
      return;
    } catch (err: any) {
      console.log("Something went wrong ",err)
    }
  }
};
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
// connectWithRetry().then(() => {
//   // app.get("/health", (_req, res) => {
//   //   res.json({ status: "ok", db: "connected" });
//   // });


// });