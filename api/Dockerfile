# Build stage: Gradle로 JAR 빌드
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Gradle wrapper 및 소스 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts ./
COPY src src

# Gradle 캐시 활용을 위해 의존성만 먼저 다운로드 (소스 변경 시 캐시 무효화 최소화)
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true

# JAR 빌드 (테스트 제외, 프로덕션 최적화)
RUN ./gradlew bootJar --no-daemon -x test

# Runtime stage: 경량 JRE 이미지
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 보안: root가 아닌 사용자로 실행
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 빌드된 JAR 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# Spring Boot는 기본 8080 포트 사용
EXPOSE 8080

# Cloud Run 등 컨테이너 메모리 제한에 맞춘 JVM 옵션
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-XX:+UseContainerSupport", "-jar", "app.jar"]
