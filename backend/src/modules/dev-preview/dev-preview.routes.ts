import { Router, Response, NextFunction } from "express";
import prisma from "../../config/database";
import { authenticate, AuthRequest } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";
import { ForbiddenError } from "../../utils/errors";

const router = Router();

router.get("/users", authenticate, adminOnly, async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "production" || req.user?.role !== "SUPER_ADMIN") {
    next(new ForbiddenError("Development user preview is disabled"));
    return;
  }

  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, email: true, role: true },
      orderBy: [{ role: "asc" }, { email: "asc" }],
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

export default router;