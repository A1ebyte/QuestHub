<p align="center">
  <img src="./logo.png" alt="Quest-Hub Logo" width="200"/>
</p>

<h1 align="center">🎮 Quest‑Hub</h1>
<p align="center">Comparador de precios de videojuegos para PC</p>

---

# 📋 Descripción del Proyecto

**Quest‑Hub** es una plataforma web que permite a los usuarios buscar videojuegos y comparar sus precios entre diferentes tiendas digitales.  
La aplicación combina datos obtenidos en tiempo real desde APIs externas con la información almacenada en la base de datos para ofrecer resultados rápidos y actualizados.

Quest‑Hub recopila:

- 🛍️ **Ofertas actuales** mediante la API de CheapShark  
- 🎮 **Información detallada de videojuegos** desde Steam API  
- 💾 **Datos persistentes** en PostgreSQL (videojuegos, géneros, tiendas, ofertas y listas de deseos)

El objetivo es ayudar a los jugadores a encontrar el mejor precio disponible en cada momento.

---

# 🛠️ Stack Tecnológico

## 🌐 Frontend
- **React**
- **Vite**
- **CSS**
- **JavaScript**

## 🖥️ Backend
- **Spring Boot**
- **Java**
- **PostgreSQL**

## 🔗 APIs Externas
- **CheapShark API**
- **Steam API**

---

# 📊 Composición del Proyecto

| Lenguaje | Porcentaje |
|----------|-----------|
| JavaScript | 54.9% |
| CSS | 24.7% |
| Java | 20.2% |
| HTML | 0.2% |

---

# 📦 Base de Datos

Quest‑Hub almacena:

- **Usuarios**
- **Videojuegos**
- **Géneros**
- **Tiendas**
- **Ofertas actuales**
- **Wishlist por usuario**
- **Relaciones entre videojuegos y géneros**
- **Videos/trailers asociados a cada juego**

> ❗ *El proyecto **no** almacena historial de precios ni genera gráficos de tendencias. Solo guarda las ofertas actuales y las actualiza periódicamente.*

---

# 🗄️ Esquema de Base de Datos

Incluye tablas como:

- `usuario`
- `videojuego`
- `genero` y `genero_videojuego`
- `tienda`
- `oferta`
- `wishlist` y `wishlist_item`
- `movie`

---

# 🔄 Flujo de Datos
CheapShark API ───┐
Steam API ────────┤
├──> Backend (Spring Boot) ──> PostgreSQL
│                                   ↑
│                                   │
└────────────── React Frontend <────┘

**Lógica del flujo:**

1. El frontend solicita datos al backend.  
2. El backend consulta la base de datos:  
   - Si los datos existen y están actualizados → se devuelven.  
   - Si no existen o están desactualizados → se consulta a las APIs externas.  
3. Los datos obtenidos se guardan/actualizan en la base de datos.  
4. El backend envía la respuesta al frontend.

---

# 📝 Características Principales

- 🔍 Búsqueda de videojuegos en tiempo real  
- 💸 Comparación de precios entre tiendas digitales  
- 📄 Información detallada de cada juego  
- 🏷️ Ofertas actualizadas periódicamente  
- ⭐ Wishlist por usuario  
- 🎬 Trailers y vídeos asociados a cada juego  
- 🎚️ Filtros avanzados (precio, tienda, género, valoración…)

---

# 📚 Documentación de la API Interna

### Endpoints principales

- `GET /api/games` — Lista todos los videojuegos  
- `GET /api/games/{id}` — Detalles de un videojuego  
- `GET /api/deals` — Ofertas actuales  
- `GET /api/deals/search` — Búsqueda de ofertas  
- `POST /api/favorites` — Añadir a favoritos/wishlist  

---

# 🚀 Instalación y Configuración

## Requisitos Previos

- **Java 11+**
- **Node.js 16+**
- **PostgreSQL 12+**
- **Git**

## Backend

```bash
cd Backend
```

Configura application.properties:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/questhub_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
```
Ejecuta:
```bash
mvn spring-boot:run
```
Disponible en: http://localhost:8080

## Frontend
```bash
cd Front
npm install
npm run dev
```
Disponible en: http://localhost:5173
