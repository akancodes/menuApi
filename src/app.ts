import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";
import connectToDatabase from "./helpers/database";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

if (!process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_NAME) {
  throw new Error("Missing DB_USER, DB_PASSWORD or DB_NAME in .env file");
}

connectToDatabase(
  process.env.DB_USER,
  process.env.DB_PASS,
  process.env.DB_NAME
);

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running");
});
