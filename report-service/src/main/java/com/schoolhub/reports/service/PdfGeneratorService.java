package com.schoolhub.reports.service;

import com.schoolhub.reports.model.StudentReport;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Generates A4 PDF report cards from {@link StudentReport} payloads using Apache PDFBox.
 * Layout is templated: header (school + student) → subjects table → footer (totals, grade, sign).
 */
@Service
public class PdfGeneratorService {

    private static final float MARGIN = 50f;
    private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();
    private static final float CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

    private static final DateTimeFormatter DOB_FORMAT = DateTimeFormatter.ofPattern("dd MMM yyyy");

    /**
     * Build a PDF report card. Returns the raw PDF bytes — caller streams them to the HTTP client.
     */
    public byte[] generateStudentReportCard(StudentReport report) throws IOException {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float y = PAGE_HEIGHT - MARGIN;
                y = drawHeader(content, report, y);
                y = drawStudentInfo(content, report, y);
                y = drawSubjectsTable(content, report, y);
                y = drawTotalsAndGrade(content, report, y);
                drawFooter(content, report);
            }

            document.save(baos);
            return baos.toByteArray();
        }
    }

    // --- header --------------------------------------------------------------

    private float drawHeader(PDPageContentStream content, StudentReport report, float y) throws IOException {
        // School name (centered, bold, large)
        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
        content.newLineAtOffset((PAGE_WIDTH - measure(report.getSchoolName(), 18, true)) / 2f, y);
        content.showText(report.getSchoolName() != null ? report.getSchoolName() : "SchoolHub School");
        content.endText();
        y -= 22;

        // School address
        if (report.getSchoolAddress() != null && !report.getSchoolAddress().isBlank()) {
            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
            content.newLineAtOffset((PAGE_WIDTH - measure(report.getSchoolAddress(), 10, false)) / 2f, y);
            content.showText(report.getSchoolAddress());
            content.endText();
            y -= 14;
        }

        // Title
        String title = "REPORT CARD — " + safe(report.getTerm()) + " (" + safe(report.getAcademicYear()) + ")";
        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
        content.newLineAtOffset((PAGE_WIDTH - measure(title, 14, true)) / 2f, y);
        content.showText(title);
        content.endText();

        y -= 18;
        drawHorizontalRule(content, y);
        return y - 14;
    }

    // --- student info --------------------------------------------------------

    private float drawStudentInfo(PDPageContentStream content, StudentReport report, float y) throws IOException {
        float labelX = MARGIN;
        float valueX = MARGIN + 110f;
        float rowGap = 16f;

        y = drawInfoRow(content, labelX, valueX, y, "Admission No:", safe(report.getAdmissionNo()));
        y = drawInfoRow(content, labelX, valueX, y, "Roll No:", safe(report.getRollNumber()));
        y = drawInfoRow(content, labelX, valueX, y, "Student Name:", safe(report.getStudentName()));
        y = drawInfoRow(content, labelX, valueX, y, "Class:", safe(report.getClassName()) + " — " + safe(report.getSectionName()));
        y = drawInfoRow(content, labelX, valueX, y, "Guardian:", safe(report.getGuardianName()));
        String dob = report.getDateOfBirth() != null ? report.getDateOfBirth().format(DOB_FORMAT) : "—";
        y = drawInfoRow(content, labelX, valueX, y, "Date of Birth:", dob);
        return y - 6;
    }

    private float drawInfoRow(PDPageContentStream content, float labelX, float valueX, float y,
                              String label, String value) throws IOException {
        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 11);
        content.newLineAtOffset(labelX, y);
        content.showText(label);
        content.endText();

        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
        content.newLineAtOffset(valueX, y);
        content.showText(value);
        content.endText();

        return y - 16f;
    }

    // --- subjects table ------------------------------------------------------

    private float drawSubjectsTable(PDPageContentStream content, StudentReport report, float y) throws IOException {
        // Section header
        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
        content.newLineAtOffset(MARGIN, y);
        content.showText("Subject Performance");
        content.endText();
        y -= 14;

        // Column layout
        float col1X = MARGIN + 0f;      // Subject
        float col2X = MARGIN + 200f;    // Code
        float col3X = MARGIN + 280f;    // Marks obtained
        float col4X = MARGIN + 380f;    // Max
        float col5X = MARGIN + 440f;    // Grade
        float col6X = MARGIN + 500f;    // Remarks

        drawTableHeader(content, col1X, col2X, col3X, col4X, col5X, col6X, y);
        y -= 14;

        List<StudentReport.SubjectMark> subjects = report.getSubjects();
        if (subjects == null || subjects.isEmpty()) {
            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE), 10);
            content.newLineAtOffset(MARGIN, y);
            content.showText("No subjects recorded.");
            content.endText();
            return y - 14;
        }

        for (StudentReport.SubjectMark s : subjects) {
            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
            content.newLineAtOffset(col1X, y);
            content.showText(truncate(safe(s.getSubjectName()), 28));
            content.endText();

            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
            content.newLineAtOffset(col2X, y);
            content.showText(safe(s.getSubjectCode()));
            content.endText();

            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
            content.newLineAtOffset(col3X, y);
            content.showText(s.getMarksObtained() != null ? String.format("%.2f", s.getMarksObtained()) : "—");
            content.endText();

            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
            content.newLineAtOffset(col4X, y);
            content.showText(s.getMaxMarks() != null ? String.format("%.0f", s.getMaxMarks()) : "—");
            content.endText();

            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
            content.newLineAtOffset(col5X, y);
            content.showText(safe(s.getGrade()));
            content.endText();

            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
            content.newLineAtOffset(col6X, y);
            content.showText(truncate(safe(s.getRemarks()), 18));
            content.endText();

            y -= 14;
            drawHorizontalRule(content, y + 4);
        }
        return y - 14;
    }

    private void drawTableHeader(PDPageContentStream content, float c1, float c2, float c3,
                                  float c4, float c5, float c6, float y) throws IOException {
        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
        content.newLineAtOffset(c1, y);
        content.showText("Subject");
        content.endText();

        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
        content.newLineAtOffset(c2, y);
        content.showText("Code");
        content.endText();

        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
        content.newLineAtOffset(c3, y);
        content.showText("Obtained");
        content.endText();

        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
        content.newLineAtOffset(c4, y);
        content.showText("Max");
        content.endText();

        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
        content.newLineAtOffset(c5, y);
        content.showText("Grade");
        content.endText();

        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
        content.newLineAtOffset(c6, y);
        content.showText("Remarks");
        content.endText();

        drawHorizontalRule(content, y - 4);
    }

    // --- totals + footer -----------------------------------------------------

    private float drawTotalsAndGrade(PDPageContentStream content, StudentReport report, float y) throws IOException {
        y -= 8;
        drawHorizontalRule(content, y);
        y -= 16;

        String totalMarks = String.format("%.2f / %.0f",
                report.getTotalMarksObtained() != null ? report.getTotalMarksObtained() : 0.0,
                report.getTotalMarksMax() != null ? report.getTotalMarksMax() : 0.0);

        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
        content.newLineAtOffset(MARGIN, y);
        content.showText("Total Marks: " + totalMarks);
        content.endText();

        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
        content.newLineAtOffset(MARGIN + 250f, y);
        content.showText("Overall Grade: " + safe(report.getOverallGrade()));
        content.endText();

        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
        content.newLineAtOffset(MARGIN + 430f, y);
        content.showText("Rank: " + (report.getRank() != null ? "#" + report.getRank() : "—"));
        content.endText();

        y -= 16;
        if (report.getAttendancePercentage() != null) {
            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
            content.newLineAtOffset(MARGIN, y);
            content.showText(String.format("Attendance: %.2f%%", report.getAttendancePercentage()));
            content.endText();
            y -= 16;
        }

        if (report.getRemarks() != null && !report.getRemarks().isBlank()) {
            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 11);
            content.newLineAtOffset(MARGIN, y);
            content.showText("Remarks:");
            content.endText();
            y -= 14;
            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
            content.newLineAtOffset(MARGIN, y);
            content.showText(truncate(report.getRemarks(), 90));
            content.endText();
        }

        return y;
    }

    private void drawFooter(PDPageContentStream content, StudentReport report) throws IOException {
        content.beginText();
        content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE), 9);
        content.newLineAtOffset(MARGIN, MARGIN);
        content.showText("Generated by SchoolHub Report Service — " +
                java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        content.endText();
    }

    // --- helpers -------------------------------------------------------------

    private void drawHorizontalRule(PDPageContentStream content, float y) throws IOException {
        content.setLineWidth(0.5f);
        content.moveTo(MARGIN, y);
        content.lineTo(PAGE_WIDTH - MARGIN, y);
        content.stroke();
    }

    private static float measure(String text, float fontSize, boolean bold) {
        try {
            PDType1Font f = new PDType1Font(bold
                    ? Standard14Fonts.FontName.HELVETICA_BOLD
                    : Standard14Fonts.FontName.HELVETICA);
            return f.getStringWidth(text) / 1000f * fontSize;
        } catch (IOException e) {
            return text.length() * fontSize * 0.5f;
        }
    }

    private static String safe(String s) {
        return s == null ? "—" : s;
    }

    private static String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max - 1) + "…";
    }
}