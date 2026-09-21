# syntax=docker/dockerfile:1.6
# Stage 1: build with Maven + Java 17
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q clean package -DskipTests

# Stage 2: minimal runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /workspace/target/schoolhub-report-service-*.jar /app/app.jar

ENV REPORT_SERVICE_PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]