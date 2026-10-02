import "dotenv/config";
import prisma from "../config/database";
import { seedDefaultSettings } from "../modules/settings/settings.service";

const SUPER_ADMIN_EMAIL = "kathirkalidass005@gmail.com";

const firstNames = ["Aarav", "Aadhya", "Arjun", "Diya", "Ishaan", "Kavya", "Nikhil", "Riya", "Vihaan", "Zoya"];
const lastNames = ["Kumar", "Sharma", "Iyer", "Patel", "Reddy", "Nair", "Das", "Singh"];
const teacherNames = [
  ["Anita", "Raman"], ["Bala", "Murugan"], ["Deepa", "Krishnan"],
  ["Farhan", "Ali"], ["Geetha", "Suresh"], ["Hari", "Mohan"],
  ["Jaya", "Kumar"], ["Karthik", "Rajan"], ["Lakshmi", "Devi"],
  ["Manoj", "Babu"], ["Nandini", "Rao"], ["Prakash", "Menon"],
  ["Revathi", "Sundar"], ["Sanjay", "Kumar"], ["Vimala", "Joseph"],
] as const;

async function findOrCreateNotice(title: string, content: string, target: "ALL" | "STUDENTS" | "TEACHERS" | "PARENTS" | "STAFF") {
  const existing = await prisma.notice.findFirst({ where: { title } });
  return existing ?? prisma.notice.create({ data: { title, content, target, publishedAt: new Date() } });
}

async function findOrCreateEvent(title: string, startDate: Date, eventType: "HOLIDAY" | "EXAM" | "MEETING" | "SPORTS" | "CULTURAL" | "GENERAL") {
  const existing = await prisma.event.findFirst({ where: { title } });
  return existing ?? prisma.event.create({ data: { title, startDate, eventType, isActive: true } });
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("The development seed is disabled when NODE_ENV=production");
  }

  if (!(await prisma.school.findFirst())) {
    await prisma.school.create({
      data: {
        schoolName: "SchoolHub International School",
        tagline: "Learn, lead, and grow together",
        address: "12 Knowledge Avenue",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001",
        phone: "+91 44 4000 5000",
        email: "office@schoolhub.local",
      },
    });
  }

  const currentYear = await prisma.academicYear.findFirst({ where: { name: "2025-2026" } }) ?? await prisma.academicYear.create({
    data: {
      name: "2025-2026",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2026-04-30"),
      isActive: true,
      terms: {
        create: [
          { name: "Term 1", startDate: new Date("2025-06-01"), endDate: new Date("2025-09-30") },
          { name: "Term 2", startDate: new Date("2025-10-01"), endDate: new Date("2026-01-15") },
          { name: "Term 3", startDate: new Date("2026-01-16"), endDate: new Date("2026-04-30") },
        ],
      },
    },
  });

  if (!(await prisma.academicYear.findFirst({ where: { name: "2024-2025" } }))) {
    await prisma.academicYear.create({
      data: { name: "2024-2025", startDate: new Date("2024-06-01"), endDate: new Date("2025-04-30"), isActive: false },
    });
  }

  const classes = [];
  for (let grade = 1; grade <= 12; grade += 1) {
    const schoolClass = await prisma.class.findFirst({ where: { name: `Grade ${grade}` } }) ?? await prisma.class.create({ data: { name: `Grade ${grade}` } });
    const sections = [];
    for (const sectionName of ["A", "B"]) {
      sections.push(await prisma.section.findFirst({ where: { classId: schoolClass.id, name: sectionName } }) ?? await prisma.section.create({
        data: { name: sectionName, classId: schoolClass.id },
      }));
    }
    classes.push({ schoolClass, sections });

    for (const subjectName of ["English", "Mathematics"]) {
      const code = `G${grade}-${subjectName.slice(0, 3).toUpperCase()}`;
      if (!(await prisma.subject.findFirst({ where: { classId: schoolClass.id, code } }))) {
        await prisma.subject.create({ data: { name: subjectName, code, type: "CORE", classId: schoolClass.id } });
      }
    }
  }

  const users = [
    { email: SUPER_ADMIN_EMAIL, role: "SUPER_ADMIN" },
    { email: "principal@schoolhub.local", role: "ADMIN" },
    { email: "coordinator@schoolhub.local", role: "ADMIN" },
    { email: "office@schoolhub.local", role: "STAFF" },
    { email: "parent.demo@schoolhub.local", role: "PARENT" },
    { email: "student.demo@schoolhub.local", role: "STUDENT" },
    { email: "librarian@schoolhub.local", role: "STAFF" },
  ];
  for (const [index, [firstName, lastName]] of teacherNames.entries()) {
    users.push({ email: `teacher${index + 1}@schoolhub.local`, role: "TEACHER" });
    const user = await prisma.user.upsert({
      where: { email: `teacher${index + 1}@schoolhub.local` },
      create: { email: `teacher${index + 1}@schoolhub.local`, password: "local-dev-only", role: "TEACHER" },
      update: { role: "TEACHER", isActive: true },
    });
    await prisma.teacher.upsert({
      where: { employeeId: `EMP-${String(index + 1).padStart(3, "0")}` },
      create: { employeeId: `EMP-${String(index + 1).padStart(3, "0")}`, firstName, lastName, designation: "Teacher", department: index % 2 ? "Sciences" : "Humanities", userId: user.id },
      update: { firstName, lastName, userId: user.id, status: "ACTIVE" },
    });
  }
  for (const user of users.slice(0, 4)) {
    await prisma.user.upsert({
      where: { email: user.email },
      create: { email: user.email, password: "local-dev-only", role: user.role },
      update: { role: user.role, isActive: true },
    });
  }

  let admissionNumber = 1;
  for (const { schoolClass, sections } of classes) {
    for (const section of sections) {
      for (let studentIndex = 0; studentIndex < 5; studentIndex += 1) {
        const firstName = firstNames[(admissionNumber - 1) % firstNames.length];
        const lastName = lastNames[(admissionNumber - 1) % lastNames.length];
        const admissionNo = `SH-${String(admissionNumber).padStart(4, "0")}`;
        await prisma.student.upsert({
          where: { admissionNo },
          create: {
            admissionNo,
            rollNumber: String(studentIndex + 1),
            firstName,
            lastName,
            gender: studentIndex % 2 ? "FEMALE" : "MALE",
            email: `${admissionNo.toLowerCase()}@schoolhub.local`,
            guardianName: `${lastName} Family`,
            guardianPhone: `90000${String(10000 + admissionNumber).slice(-5)}`,
            status: "ACTIVE",
            classId: schoolClass.id,
            sectionId: section.id,
          },
          update: { classId: schoolClass.id, sectionId: section.id, status: "ACTIVE" },
        });
        admissionNumber += 1;
      }
    }
  }

  await seedDefaultSettings();
  await Promise.all([
    findOrCreateNotice("Welcome to the new academic year", "Welcome back to SchoolHub. Please review the academic calendar and class schedules.", "ALL"),
    findOrCreateNotice("Parent orientation", "Parent orientation sessions are scheduled for the first Saturday of the month.", "PARENTS"),
    findOrCreateNotice("Attendance review", "Teachers should complete attendance before 9:30 AM each school day.", "TEACHERS"),
    findOrCreateNotice("Library week", "Students may participate in the annual reading and library activities.", "STUDENTS"),
    findOrCreateEvent("Independence Day Celebration", new Date("2025-08-15T09:00:00Z"), "CULTURAL"),
    findOrCreateEvent("Mid-term examinations", new Date("2025-09-15T09:00:00Z"), "EXAM"),
    findOrCreateEvent("Annual sports day", new Date("2026-02-20T09:00:00Z"), "SPORTS"),
    findOrCreateEvent("Parent teacher meeting", new Date("2026-03-07T09:00:00Z"), "MEETING"),
  ]);

  console.log(`Seeded SchoolHub development data for ${currentYear.name}: ${admissionNumber - 1} students, ${teacherNames.length} teachers, 12 classes, and demo content.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());