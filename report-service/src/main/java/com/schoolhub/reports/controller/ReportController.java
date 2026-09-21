package com.schoolhub.reports.controller;

import com.schoolhub.reports.model.StudentReport;
import com.schoolhub.reports.service.PdfGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * REST controller for PDF report generation.
 * <p>
 * The SchoolHub backend Express server POSTs a {@link StudentReport} payload here and
 * receives a binary PDF in return.
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final PdfGeneratorService pdfGeneratorService;

    @Autowired
    public ReportController(PdfGeneratorService pdfGeneratorService) {
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @PostMapping(value = "/student", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateStudentReport(@RequestBody StudentReport report) {
        try {
            byte[] pdf = pdfGeneratorService.generateStudentReportCard(report);
            String filename = buildFilename(report);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdf.length);
            return ResponseEntity.ok().headers(headers).body(pdf);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(("Failed to generate PDF: " + e.getMessage()).getBytes());
        }
    }

    @PostMapping(value = "/health", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<java.util.Map<String, String>> health() {
        return ResponseEntity.ok(java.util.Map.of(
                "status", "ok",
                "service", "schoolhub-report-service",
                "version", "1.0.0"
        ));
    }

    private static String buildFilename(StudentReport r) {
        String name = r.getStudentName() == null ? "student" : r.getStudentName().replaceAll("[^a-zA-Z0-9-]", "_");
        String term = r.getTerm() == null ? "report" : r.getTerm().replaceAll("[^a-zA-Z0-9-]", "_");
        return String.format("report_%s_%s.pdf", name, term);
    }
}