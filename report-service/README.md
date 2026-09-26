# SchoolHub Report Service (Maven / Java)

> Java 17 + Spring Boot + Apache PDFBox PDF generation service.
> Implements syllabus requirement for Maven/Gradle build tooling while
> satisfying DEC-006 (`report-service/` is a real Java service for PDFs).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/reports/student` | Generate a PDF report card from a JSON payload |
| `POST` | `/api/reports/health` | Health check (JSON) |

## Build & Run

```bash
mvn clean package          # produces target/schoolhub-report-service-*.jar
java -jar target/schoolhub-report-service-*.jar
# or
mvn spring-boot:run
```

## Docker

```bash
docker build -t schoolhub/report-service .
docker run -p 8080:8080 schoolhub/report-service
```

## Sample Payload

```json
{
  "schoolName": "Delhi Public School",
  "schoolAddress": "New Delhi, India",
  "academicYear": "2025-2026",
  "term": "Mid-Term",
  "admissionNo": "DPS-2024-001",
  "rollNumber": "12",
  "studentName": "Aarav Sharma",
  "className": "Grade 10",
  "sectionName": "A",
  "guardianName": "Rajesh Sharma",
  "dateOfBirth": "2008-04-12",
  "subjects": [
    { "subjectName": "Mathematics", "subjectCode": "MTH", "marksObtained": 88, "maxMarks": 100, "grade": "A+" },
    { "subjectName": "English", "subjectCode": "ENG", "marksObtained": 76.5, "maxMarks": 100, "grade": "B+" }
  ],
  "totalMarksObtained": 164.5,
  "totalMarksMax": 200,
  "overallGrade": "A",
  "rank": 3,
  "attendancePercentage": 94.5,
  "remarks": "Excellent progress this term."
}
```

## Tests

```bash
mvn test
```

The `PdfGeneratorServiceTest` covers:
- full report with all fields
- minimal payload (only required fields)
- empty subjects list
- validates PDF magic header bytes

## Integration with SchoolHub Backend

`backend/src/modules/examination/examination.service.ts` POSTs the assembled
`StudentReport` payload to this service URL (`REPORT_SERVICE_URL` env var,
default `http://localhost:8080`). The binary PDF response is forwarded to
the client as a download.