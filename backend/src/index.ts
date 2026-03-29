import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import { authMiddleware } from "./middleware/auth";
import listingsRouter from "./routes/listing";

dotenv.config();

const app = express();
app.use(express.json());
app.use(authMiddleware);

const PORT = process.env.PORT || 5000;

const connectWithRetry = async (retries = 10, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await AppDataSource.initialize();
      console.log("✅ DB connected");
      return;
    } catch (err: any) {
      console.log(`⏳ DB not ready, attempt ${i}/${retries}... retrying in ${delay / 1000}s`);
      if (i === retries) {
        console.error(" Could not connect to DB after max retries:", err.message);
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

connectWithRetry().then(() => {
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", db: "connected" });
  });

  app.use("/listings", listingsRouter);

  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
});