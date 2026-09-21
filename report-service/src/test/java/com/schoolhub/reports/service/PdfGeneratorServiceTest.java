package com.schoolhub.reports.service;

import com.schoolhub.reports.model.StudentReport;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PdfGeneratorServiceTest {

    private final PdfGeneratorService service = new PdfGeneratorService();

    @Test
    void generatesValidPdfForFullReport() throws Exception {
        StudentReport report = StudentReport.builder()
                .schoolName("Delhi Public School")
                .schoolAddress("New Delhi, India")
                .academicYear("2025-2026")
                .term("Mid-Term")
                .admissionNo("DPS-2024-001")
                .rollNumber("12")
                .studentName("Aarav Sharma")
                .className("Grade 10")
                .sectionName("A")
                .guardianName("Rajesh Sharma")
                .dateOfBirth(LocalDate.of(2008, 4, 12))
                .subjects(List.of(
                        StudentReport.SubjectMark.builder()
                                .subjectName("Mathematics")
                                .subjectCode("MTH")
                                .marksObtained(88.0)
                                .maxMarks(100.0)
                                .grade("A+")
                                .build(),
                        StudentReport.SubjectMark.builder()
                                .subjectName("English")
                                .subjectCode("ENG")
                                .marksObtained(76.5)
                                .maxMarks(100.0)
                                .grade("B+")
                                .build()
                ))
                .totalMarksObtained(164.5)
                .totalMarksMax(200.0)
                .overallGrade("A")
                .rank(3)
                .attendancePercentage(94.5)
                .remarks("Excellent progress this term.")
                .build();

        byte[] pdf = service.generateStudentReportCard(report);
        assertNotNull(pdf);
        assertTrue(pdf.length > 100, "PDF should have meaningful size");
        // PDF magic header
        assertEquals('%', (char) pdf[0]);
        assertEquals('P', (char) pdf[1]);
        assertEquals('D', (char) pdf[2]);
        assertEquals('F', (char) pdf[3]);
    }

    @Test
    void handlesMinimalReportWithoutOptionalFields() throws Exception {
        StudentReport report = StudentReport.builder()
                .schoolName("Test School")
                .studentName("Test Student")
                .build();

        byte[] pdf = service.generateStudentReportCard(report);
        assertNotNull(pdf);
        assertTrue(pdf.length > 100);
    }

    @Test
    void handlesEmptySubjectsListGracefully() throws Exception {
        StudentReport report = StudentReport.builder()
                .schoolName("Test School")
                .studentName("Test Student")
                .subjects(List.of())
                .build();

        byte[] pdf = service.generateStudentReportCard(report);
        assertNotNull(pdf);
        assertTrue(pdf.length > 100);
    }
}