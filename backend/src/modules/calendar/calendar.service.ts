import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

interface HolidayInput {
  name: string;
  date: string;
  type?: "PUBLIC" | "ACADEMIC" | "EMERGENCY";
  isRecurring?: boolean;
}

export async function getCalendar(month?: number, year?: number) {
  const now = new Date();
  const filterMonth = month ?? now.getMonth() + 1;
  const filterYear = year ?? now.getFullYear();

  const startDate = new Date(filterYear, filterMonth - 1, 1);
  const endDate = new Date(filterYear, filterMonth, 0, 23, 59, 59);

  const holidays = await prisma.holiday.findMany({
    where: {
      OR: [
        { date: { gte: startDate, lte: endDate } },
        { isRecurring: true },
      ],
    },
    orderBy: { date: "asc" },
  });

  return { month: filterMonth, year: filterYear, holidays };
}

export async function listHolidays() {
  return prisma.holiday.findMany({ orderBy: { date: "asc" } });
}

export async function addHoliday(data: HolidayInput) {
  return prisma.holiday.create({
    data: {
      name: data.name,
      date: new Date(data.date),
      type: data.type ?? "PUBLIC",
      isRecurring: data.isRecurring ?? false,
    },
  });
}

export async function removeHoliday(id: string) {
  const existing = await prisma.holiday.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Holiday");

  return prisma.holiday.delete({ where: { id } });
}
