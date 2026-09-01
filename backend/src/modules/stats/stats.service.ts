import prisma from "../../config/database";

export async function getStats() {
  const [
    teachers,
    activeTeachers,
    classes,
    sections,
    subjects,
    timetableEntries,
    holidays,
  ] = await Promise.all([
    prisma.teacher.count(),
    prisma.teacher.count({ where: { status: "ACTIVE" } }),
    prisma.class.count(),
    prisma.section.count(),
    prisma.subject.count(),
    prisma.timetableEntry.count(),
    prisma.holiday.count(),
  ]);

  return {
    totals: {
      teachers,
      activeTeachers,
      classes,
      sections,
      subjects,
      timetableEntries,
      holidays,
    },
    recentTeachers: await prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeId: true,
        designation: true,
        status: true,
      },
    }),
    classesWithSections: await prisma.class.findMany({
      include: {
        _count: { select: { sections: true } },
      },
      orderBy: { name: "asc" },
    }),
  };
}