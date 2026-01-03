FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy the jar from the INNER project folder
COPY taskmanager/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
