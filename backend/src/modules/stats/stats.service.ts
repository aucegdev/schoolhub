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
    students,
    activeStudents,
    exams,
    pendingLeaves,
    unreadNotifications,
    vehicles,
    routes,
    notices,
    events,
  ] = await Promise.all([
    prisma.teacher.count(),
    prisma.teacher.count({ where: { status: "ACTIVE" } }),
    prisma.class.count(),
    prisma.section.count(),
    prisma.subject.count(),
    prisma.timetableEntry.count(),
    prisma.holiday.count(),
    prisma.student.count(),
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.exam.count(),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.notification.count({ where: { isRead: false } }),
    prisma.vehicle.count({ where: { status: "ACTIVE" } }),
    prisma.transportRoute.count(),
    prisma.notice.count({ where: { isActive: true } }),
    prisma.event.count({ where: { isActive: true } }),
  ]);

  return {
    totals: {
      teachers, activeTeachers, classes, sections, subjects, timetableEntries, holidays,
      students, activeStudents, exams, pendingLeaves, unreadNotifications, vehicles, routes, notices, events,
    },
    recentTeachers: await prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true, status: true },
    }),
    recentStudents: await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, firstName: true, lastName: true, admissionNo: true, class: { select: { name: true } } },
    }),
    classesWithSections: await prisma.class.findMany({
      include: { _count: { select: { sections: true } } },
      orderBy: { name: "asc" },
    }),
    upcomingEvents: await prisma.event.findMany({
      where: { startDate: { gte: new Date() }, isActive: true },
      orderBy: { startDate: "asc" },
      take: 5,
    }),
    recentNotices: await prisma.notice.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  };
}