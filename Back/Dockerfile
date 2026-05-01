# --- ETAPA 1: Compilación ---
# Usamos JDK 21 que es el estándar para Spring Boot 4
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /home/gradle/src

# Copiamos todo el contenido
COPY . .

# En lugar de usar 'gradle' instalado en el sistema, usamos el 'wrapper'
# que viene en tu proyecto (gradlew), que descargará la versión correcta automáticamente
RUN chmod +x gradlew
RUN ./gradlew build --no-daemon -x test

# --- ETAPA 2: Ejecución ---
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copiamos el JAR desde la etapa "build"
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar

EXPOSE 8080

# Mantenemos el límite de memoria para el plan gratis
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]