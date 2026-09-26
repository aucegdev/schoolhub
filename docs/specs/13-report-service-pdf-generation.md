# Feature Spec 13 — Maven Report Service (PDF Generation)

## Objective
Implement a standalone Maven/Java PDF report generation service that satisfies the course syllabus build-tool requirement while providing real PDF report cards to SchoolHub.

## Scope
- **New service:** `report-service/` — Java 17 + Spring Boot + Maven 3.9
- **PDF engine:** Apache PDFBox 3.0.3 (layout-controlled A4 PDFs)
- **Integration:** Backend Express server proxies requests to report-service via HTTP
- **Docker:** Multi-stage Dockerfile (Maven build → JRE runtime)

## Requirements

### Functional
1. `POST /api/reports/student` — Accepts `StudentReport` JSON payload, returns PDF bytes
2. `POST /api/reports/health` — Health check endpoint
3. PDF layout: School header → Student info grid → Subject marks table → Totals/Grade footer
4. Backend endpoint `POST /api/v1/exams/:examId/report-card/:studentId` proxies to report-service

### Non-Functional
1. Response time < 2s for a single report card
2. PDF validates against PDF/A-2b where possible (generator creates compatible output)
3. Service starts in < 15s on container boot

### Dependencies
- **Java:** 17 (Temurin/Alpine)
- **Spring Boot:** 3.3.5 (provides embedded Tomcat)
- **PDFBox:** 3.0.3
- **Maven:** 3.9.x
- **Docker:** multi-stage build

### API Contract

#### Request (to backend)
```
POST /api/v1/exams/{examId}/report-card/{studentId}
Content-Type: application/json
Authorization: Bearer <token>

Body: { academicYear?: string }
```

#### Response
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=report_<admissionNo>_<term>.pdf
<binary PDF>
```

### Grading Logic
- >= 90%: A+
- >= 75%: A
- >= 60%: B+
- >= 45%: B
- < 45%: C

### Testing
- `PdfGeneratorServiceTest` — 3 test cases (full report, minimal, empty subjects)
- PDF magic header validation
- Coverage: >= 80% for `PdfGeneratorService`

## Files Created
| File | Purpose |
|------|---------|
| `report-service/pom.xml` | Maven build config |
| `report-service/src/main/java/.../ReportServiceApplication.java` | Spring Boot entry |
| `report-service/src/main/java/.../model/StudentReport.java` | Payload DTO |
| `report-service/src/main/java/.../controller/ReportController.java` | REST controller |
| `report-service/src/main/java/.../service/PdfGeneratorService.java` | PDF generation engine |
| `report-service/src/test/.../PdfGeneratorServiceTest.java` | Unit tests |
| `report-service/src/main/resources/application.properties` | Config |
| `report-service/Dockerfile` | Multi-stage Docker |
| `report-service/README.md` | Documentation |

## Status
**COMPLETED** — All 9 files created. Integration wired into backend + docker-compose.

## Related
- DEC-006 (Maven Report Service)
- TASK-012 (Reports & Analytics + Maven Report Service)
- BUG-008 from original bug tracker
