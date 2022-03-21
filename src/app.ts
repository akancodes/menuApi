import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(helmet());
app.use(cors());

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running");
});
