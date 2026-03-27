import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";

dotenv.config();

const app = express();
app.use(express.json());

AppDataSource.initialize().then(() => {
  console.log("DB connected");

  app.listen(5000, () => {
    console.log("Server running");
  });
});