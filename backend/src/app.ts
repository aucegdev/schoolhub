import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import schoolRoutes from "./modules/school/school.routes";
import academicYearRoutes from "./modules/academic-year/academic-year.routes";
import termRoutes from "./modules/term/term.routes";
import calendarRoutes from "./modules/calendar/calendar.routes";
import teacherRoutes from "./modules/teacher/teacher.routes";
import teacherAssignmentRoutes from "./modules/teacher-assignment/teacher-assignment.routes";
import statsRoutes from "./modules/stats/stats.routes";
import leaveRoutes from "./modules/leave/leave.routes";
import classRoutes from "./modules/class/class.routes";
import subjectRoutes from "./modules/subject/subject.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/school", schoolRoutes);
app.use("/api/v1/academic-years", academicYearRoutes);
app.use("/api/v1/terms", termRoutes);
app.use("/api/v1/calendar", calendarRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/assignments", teacherAssignmentRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/leaves", leaveRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/subjects", subjectRoutes);

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "SchoolHub API is running", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
