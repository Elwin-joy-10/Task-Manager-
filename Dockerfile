# ---------- BUILD STAGE ----------
FROM eclipse-temurin:21-jdk AS build

WORKDIR /build

# Copy Maven wrapper and config
COPY taskmanager/mvnw taskmanager/mvnw.cmd ./
COPY taskmanager/.mvn .mvn
COPY taskmanager/pom.xml ./

# ✅ Fix permissions & line endings
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw -B dependency:go-offline

# Copy source code
COPY taskmanager/src src

# Build the JAR
RUN ./mvnw clean package -DskipTests


# ---------- RUN STAGE ----------
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=build /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
