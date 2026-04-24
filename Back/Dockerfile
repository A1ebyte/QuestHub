# --- ETAPA 1: Compilación ---
FROM gradle:8.5-jdk17 AS build
WORKDIR /home/gradle/src

# Copiamos los archivos del proyecto al contenedor
# (Como pusimos Root Directory: Back en Render, esto copia lo que hay en Back)
COPY --chown=gradle:gradle . .

# Ejecutamos la compilación de Gradle
RUN gradle build --no-daemon -x test

# --- ETAPA 2: Ejecución ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Aquí está el truco: copiamos el JAR desde la etapa "build"
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar

# Exponemos el puerto
EXPOSE 8080

# Comando de arranque con límite de memoria para el plan gratis
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]