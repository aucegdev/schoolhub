import { Request, Response, NextFunction } from "express";
import prisma from "../../config/database";
import * as examService from "./examination.service";

export async function listExams(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await examService.listExams({
      classId: req.query.classId as string,
      subjectId: req.query.subjectId as string,
      examType: req.query.examType as string,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getExam(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await examService.getExamById(req.params.id as string);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createExam(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await examService.createExam(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function enterMarks(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await examService.enterMarks(req.params.id as string, req.body.marks);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function generateReportCard(req: Request, res: Response, next: NextFunction) {
  try {
    const examId = req.params.examId || req.params.id;
    const studentId = req.params.studentId || req.params.id;
    const [exam, marks, student] = await Promise.all([
      prisma.exam.findUnique({ where: { id: examId as string }, include: { subject: true } as any }),
      prisma.examMark.findMany({ where: { examId: examId as string }, include: { student: true } as any }),
      prisma.student.findUnique({ where: { id: studentId as string }, include: { class: true, section: true } as any }),
    ]);
    if (!exam) { res.status(404).json({ success: false, message: "Exam not found" }); return; }
    if (!student) { res.status(404).json({ success: false, message: "Student not found" }); return; }

    const totalObtained = marks.reduce((s, m) => s + m.marksObtained, 0);
    const totalMax = marks.length * exam.totalMarks;
    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    const grade = percentage >= 90 ? "A+" : percentage >= 75 ? "A" : percentage >= 60 ? "B+" : percentage >= 45 ? "B" : "C";

    const className = (student as any).class?.name || "";
    const sectionName = (student as any).section?.name || "";
    const examSubject = (exam as any).subject;

    const payload = {
      schoolName: process.env.SCHOOL_NAME || "SchoolHub School",
      schoolAddress: process.env.SCHOOL_ADDRESS || "",
      academicYear: req.body.academicYear || "2025-2026",
      term: exam.examType,
      admissionNo: student.admissionNo,
      rollNumber: student.rollNumber || "",
      studentName: `${student.firstName} ${student.lastName}`,
      className,
      sectionName,
      guardianName: student.guardianName || "",
      dateOfBirth: student.dateOfBirth?.toISOString().split("T")[0] || "",
      subjects: marks.map((m) => ({
        subjectName: examSubject?.name || "Unknown",
        subjectCode: examSubject?.code || "",
        marksObtained: m.marksObtained,
        maxMarks: exam.totalMarks,
        grade,
        remarks: m.remarks || "",
      })),
      totalMarksObtained: totalObtained,
      totalMarksMax: totalMax,
      overallGrade: grade,
      rank: 0,
      attendancePercentage: 0,
      remarks: "",
    };

    const reportUrl = process.env.REPORT_SERVICE_URL || "http://localhost:8080";
    const http = (await import("http")).default;

    const postData = JSON.stringify(payload);
    const options = { hostname: new URL(reportUrl).hostname, port: new URL(reportUrl).port || 80, path: "/api/reports/student", method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(postData) } };

    const result = await new Promise<{ statusCode: number; headers: Record<string, string>; body: Buffer }>((resolve) => {
      const req2 = http.request(options, (res2: any) => { const chunks: Buffer[] = []; res2.on("data", (d: Buffer) => chunks.push(d)); res2.on("end", () => resolve({ statusCode: res2.statusCode, headers: res2.headers as Record<string, string>, body: Buffer.concat(chunks) })); });
      req2.write(postData);
      req2.end();
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=report_${student.admissionNo}_${exam.examType}.pdf`);
    res.status(result.statusCode).send(result.body);
  } catch (error) {
    next(error);
  }
}
