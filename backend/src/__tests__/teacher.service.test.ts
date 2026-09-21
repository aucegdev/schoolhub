import prisma from "../config/database";
import { generateEmployeeId } from "../modules/teacher/teacher.service";
import { listStudents, createStudent, getStudentById, deleteStudent } from "../modules/student/student.service";

jest.mock("../config/database", () => ({
  __esModule: true,
  default: {
    teacher: { findFirst: jest.fn(), create: jest.fn() },
    student: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Teacher Service - generateEmployeeId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the first sequence when no teachers exist", async () => {
    (mockPrisma.teacher.findFirst as jest.Mock).mockResolvedValue(null);
    const id = await generateEmployeeId();
    expect(id).toMatch(/^TCH-2026-0001$/);
  });

  it("increments the sequence from the last teacher", async () => {
    (mockPrisma.teacher.findFirst as jest.Mock).mockResolvedValue({ employeeId: "TCH-2026-0003" });
    const id = await generateEmployeeId();
    expect(id).toBe("TCH-2026-0004");
  });
});

describe("Student Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getStudentById throws NotFoundError when student missing", async () => {
    (mockPrisma.student.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(getStudentById("missing-id")).rejects.toThrow("Student not found");
  });

  it("createStudent calls prisma with correct data", async () => {
    const created = { id: "s1", firstName: "Test", lastName: "Student" };
    (mockPrisma.student.create as jest.Mock).mockResolvedValue(created);
    const result = await createStudent({ admissionNo: "ADM-001", firstName: "Test", lastName: "Student" });
    expect(result).toEqual(created);
    expect(mockPrisma.student.create).toHaveBeenCalledTimes(1);
  });

  it("deleteStudent calls prisma delete", async () => {
    (mockPrisma.student.findUnique as jest.Mock).mockResolvedValue({ id: "s1" });
    (mockPrisma.student.delete as jest.Mock).mockResolvedValue({ id: "s1" });
    await expect(deleteStudent("s1")).resolves.toBeUndefined();
  });
});