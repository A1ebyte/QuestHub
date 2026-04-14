<p align="center">
  <img src="./Front/public/Imagenes/Logo.png" alt="Quest-Hub Logo" width="300"/>
</p>

<h3 align="center">Comparador de precios de videojuegos para PC</h3>
<br>

# 📋 Descripción del Proyecto

**Quest‑Hub** es una plataforma web que permite a los usuarios buscar videojuegos y comparar sus precios entre diferentes tiendas digitales.  
La aplicación combina datos obtenidos en tiempo real desde APIs externas con la información almacenada en la base de datos para ofrecer resultados rápidos y actualizados.

Quest‑Hub recopila:

- **Ofertas actuales** mediante la API de CheapShark  
- **Información detallada de videojuegos** desde Steam API  
- **Datos persistentes** en PostgreSQL (videojuegos, géneros, tiendas, ofertas y listas de deseos)

El objetivo es ayudar a los jugadores a encontrar el mejor precio disponible en cada momento.

# 🛠️ Stack Tecnológico

## Frontend
- **React**
- **Vite**
- **CSS**
- **JavaScript**

## Backend
- **Spring Boot**
- **Java**
- **PostgreSQL**

## APIs Externas
- **CheapShark:** https://apidocs.cheapshark.com/

- **Steam:** https://steamcommunity.com/dev

# 📦 Base de Datos

Quest‑Hub almacena:

- **Usuarios**
- **Videojuegos**: En desarrollo
- **Géneros**
- **Tiendas**
- **Ofertas actuales**
- **Wishlist por usuario**: En desarrollo
- **Relaciones entre videojuegos y géneros**
- **Ofertas asociadas a su Tienda correspondiente**
- **Videos/trailers asociados a cada juego**

> ❗ *El proyecto **no** almacena historial de precios ni genera gráficos de tendencias de momento. Solo guarda las ofertas actuales y las actualiza periódicamente.*


# 🗄️ Esquema de Base de Datos

Incluye tablas como:

- `usuario`
- `videojuego`
- `genero` y `genero_videojuego`
- `tienda`
- `oferta`
- `wishlist` y `wishlist_item`
- `movie`


# 🔄 Flujo de Datos
```text
CheapShark API ───┐
Steam API ────────┤
                  ↓
┌──> Backend (Spring Boot) ──> PostgreSQL
│                                   │
│                                   │
└────────────── React Frontend <────┘
```
**Lógica del flujo:**

1. El frontend solicita datos al backend.  
2. El backend consulta la base de datos:  
   - Si los datos existen y están actualizados → se devuelven.  
   - Si no existen o están desactualizados → se consulta a las APIs externas.  
3. Los datos obtenidos se guardan/actualizan en la base de datos.  
4. El backend envía la respuesta al frontend.


# 📝 Características Principales

- 🔍 Búsqueda de ofertas de videojuegos en tiempo real  
- 💸 Comparación de precios entre tiendas digitales  
- 📄 Información detallada de cada juego: **En desarrollo**
- 🏷️ Ofertas actualizadas periódicamente
- 👤 Registro y sesiones de usuarios: **En desarrollo**
- ⭐ Wishlist por usuario: **En desarrollo**
- 🎬 Trailers y vídeos asociados a cada juego
- 📮 Notificaciones de descuentos: **En desarrollo**
- 🎚️ Filtros avanzados (precio, tienda, género, valoración…): **En desarrollo**

# 📚 Documentación de la API Interna

### Endpoints principales
**Ejemplos de Endpoints**
- `GET /api/games` — Lista todos los videojuegos  
- `GET /api/games/{id}` — Detalles de un videojuego  
- `GET /api/deals` — Ofertas actuales  
- `GET /api/deals/search` — Búsqueda de ofertas  
- `POST /api/favorites` — Añadir a favoritos/wishlist  

# 🚀 Instalación y Configuración

## Requisitos Previos

- **Java 11+** para el backend
- **Node.js 16+** y **npm** para el frontend
- **PostgreSQL 12+** para la base de datos
- **Git** para clonar el repositorio

## Backend (Spring Boot)

1. Navega a la carpeta del backend:
```bash
cd Backend
```

2. Configura la conexión a PostgreSQL en `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/videogames_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
```

3. Compila e inicia la aplicación:
```bash
mvn spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`

## Frontend (React + Vite)

1. Navega a la carpeta del frontend:
```bash
cd Front
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Construye para producción:
```bash
npm run build
```

La aplicación estará disponible en `http://localhost:5173`

# 👤 Autores

[**A1ebyte**](https://github.com/A1ebyte) - Freddy De Andrade Bernabeu  
[**KerinR432**](https://github.com/KerinR432) - Kerin Aguilera  
[**MoBaSell**](https://github.com/MoBaSell) - Mohamed Bada Sellami  

# 🎯 Estado del Proyecto

**Estado:** En desarrollo 🔧

Última actualización: 2026-04-14

