import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export async function listSettings(category?: string) {
  const where = category ? { category } : {};
  return prisma.setting.findMany({ where, orderBy: { category: "asc" } });
}

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  if (!setting) throw new NotFoundError("Setting");
  return setting;
}

export async function updateSetting(key: string, value: string, category?: string, updatedBy?: string) {
  await getSetting(key);
  const updateData: Record<string, unknown> = { value };
  if (category) updateData.category = category;
  if (updatedBy) updateData.updatedBy = updatedBy;
  return prisma.setting.update({ where: { key }, data: updateData });
}

export async function setSetting(data: { key: string; value: string; category?: string }) {
  return prisma.setting.upsert({
    where: { key: data.key },
    create: { key: data.key, value: data.value, category: data.category || "GENERAL" },
    update: { value: data.value, category: data.category || "GENERAL" },
  });
}

export async function deleteSetting(key: string) {
  await getSetting(key);
  return prisma.setting.delete({ where: { key } });
}

// Predefined settings — call once on first run
export async function seedDefaultSettings() {
  const defaults: { key: string; value: string; category: string }[] = [
    { key: "school_name", value: "SchoolHub", category: "GENERAL" },
    { key: "school_address", value: "", category: "GENERAL" },
    { key: "academic_year", value: "2025-2026", category: "ACADEMIC" },
    { key: "enable_attendance", value: "true", category: "MODULES" },
    { key: "enable_exams", value: "true", category: "MODULES" },
    { key: "enable_fees", value: "true", category: "MODULES" },
    { key: "enable_transport", value: "true", category: "MODULES" },
    { key: "enable_notifications", value: "true", category: "MODULES" },
    { key: "default_timezone", value: "Asia/Kolkata", category: "SYSTEM" },
    { key: "currency", value: "INR", category: "SYSTEM" },
    { key: "fee_due_reminder_days", value: "7", category: "FEES" },
    { key: "attendance_late_minutes", value: "15", category: "ATTENDANCE" },
  ];

  for (const s of defaults) {
    await prisma.setting.upsert({ where: { key: s.key }, create: s, update: { value: s.value } });
  }
  return defaults;
}