import fs from "fs";
import path from "path";

export const uploadsDirectory = path.resolve(
  process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads")
);

fs.mkdirSync(uploadsDirectory, { recursive: true });
