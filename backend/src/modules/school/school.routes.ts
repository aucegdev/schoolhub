import { Router } from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";
import * as schoolController from "./school.controller";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../../uploads"));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `school-logo${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".svg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, png, svg) are allowed"));
    }
  },
});

const router = Router();

router.get("/", authenticate, schoolController.getSchoolInfo);
router.put("/", authenticate, adminOnly, schoolController.updateSchoolInfo);
router.post("/logo", authenticate, adminOnly, upload.single("logo"), schoolController.uploadLogo);

export default router;
