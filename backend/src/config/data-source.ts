import "reflect-metadata";
import { DataSource } from "typeorm";
import { Property } from "../entities/property";
import { Agent } from "../entities/agent";
import dotenv from "dotenv";

dotenv.config();

// console.log("DB CONFIG:", {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   db: process.env.DB_NAME,
// });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "suman",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "realestate",
  synchronize: false,
  logging: true,
  entities: [Property, Agent],
  migrations: ["src/migrations/*.ts"], 
});