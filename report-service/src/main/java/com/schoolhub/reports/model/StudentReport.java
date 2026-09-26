package com.schoolhub.reports.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Data Transfer Object for student report card PDF generation.
 * Received from SchoolHub backend as JSON; rendered into a PDF report card.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentReport {

    private String schoolName;
    private String schoolAddress;
    private String academicYear;
    private String term;

    private String admissionNo;
    private String rollNumber;
    private String studentName;
    private String className;
    private String sectionName;
    private String guardianName;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private List<SubjectMark> subjects;
    private Double totalMarksObtained;
    private Double totalMarksMax;
    private String overallGrade;
    private Integer rank;
    private Double attendancePercentage;

    private String remarks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectMark {
        private String subjectName;
        private String subjectCode;
        private Double marksObtained;
        private Double maxMarks;
        private String grade;
        private String remarks;
    }
}