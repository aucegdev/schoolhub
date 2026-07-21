import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import schoolRoutes from "./modules/school/school.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/school", schoolRoutes);

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "SchoolHub API is running", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
