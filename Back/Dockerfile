# Paso 1: Usamos una imagen de Java 17 o 21 (la que estéis usando)
# 'eclipse-temurin' es la versión recomendada por la comunidad actualmente
FROM eclipse-temurin:17-jdk-alpine

# Paso 2: Creamos un directorio de trabajo dentro del servidor
WORKDIR /app

# Paso 3: Copiamos el archivo JAR que genera Gradle al servidor
# Nota: Asegúrate de que el nombre coincida con el que genera tu build
COPY build/libs/*.jar app.jar

# Paso 4: Exponemos el puerto (aunque Render lo gestiona, es buena práctica)
EXPOSE 8080

# Paso 5: El comando para arrancar la aplicación
# Usamos parámetros para optimizar la memoria RAM en el plan gratuito
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]