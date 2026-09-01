import prisma from "../../config/database";

export async function markAttendance(data: {
  classId: string;
  sectionId: string;
  date: string;
  records: { studentId: string; status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"; remarks?: string }[];
}) {
  const targetDate = new Date(data.date);

  const results = await prisma.$transaction(
    data.records.map((r) =>
      prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: r.studentId,
            date: targetDate,
          },
        },
        create: {
          studentId: r.studentId,
          classId: data.classId,
          sectionId: data.sectionId,
          date: targetDate,
          status: r.status,
          remarks: r.remarks,
        },
        update: {
          status: r.status,
          remarks: r.remarks,
        },
      })
    )
  );

  return results;
}

export async function getAttendance(query: {
  classId?: string;
  sectionId?: string;
  date?: string;
  studentId?: string;
}) {
  const where: any = {};

  if (query.classId) where.classId = query.classId;
  if (query.sectionId) where.sectionId = query.sectionId;
  if (query.studentId) where.studentId = query.studentId;
  if (query.date) {
    const target = new Date(query.date);
    const nextDay = new Date(target);
    nextDay.setDate(nextDay.getDate() + 1);
    where.date = {
      gte: target,
      lt: nextDay,
    };
  }

  const records = await prisma.attendance.findMany({
    where,
    include: {
      student: true,
    },
    orderBy: { date: "desc" },
  });

  return records;
}

export async function getAttendanceSummary(classId: string, sectionId: string, dateStr?: string) {
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const records = await prisma.attendance.findMany({
    where: {
      classId,
      sectionId,
      date: {
        gte: targetDate,
        lt: nextDay,
      },
    },
  });

  const totals = {
    total: records.length,
    present: records.filter((r) => r.status === "PRESENT").length,
    absent: records.filter((r) => r.status === "ABSENT").length,
    late: records.filter((r) => r.status === "LATE").length,
    excused: records.filter((r) => r.status === "EXCUSED").length,
  };

  return totals;
}
