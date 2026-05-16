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
- **Datos persistentes** en PostgreSQL (videojuegos, géneros, tiendas, ofertas, etc...)

El objetivo es ayudar a los jugadores a encontrar el mejor precio disponible en cada momento.

# 🛠️ Stack Tecnológico

## Frontend
- **React**
- **Vite**
- **CSS**
- **JavaScript**
- **TypeScript**

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
- **Videojuegos**
- **Bundles**
- **Géneros**
- **Tiendas**
- **Ofertas actuales**
- **Wishlist por usuario**
- **Relaciones entre las distintas entidades**
- **Ofertas asociadas a su Tienda correspondiente**
- **Videos/Imagenes asociados a cada juego**

> ❗ *El proyecto **no** almacena historial de precios ni genera gráficos de tendencias de momento. Solo guarda las ofertas actuales y las actualiza periódicamente.*


# 🗄️ Esquema de Base de Datos

Incluye tablas como:

- `usuario`
- `videojuego` y `bundle`
- `genero` y `genero_videojuego`
- `tienda`
- `oferta`
- `wishlist` y `wishlist_item`
- `movie`
- `capturas`


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

- 🔍 Búsqueda de ofertas de videojuegos  
- 💸 Comparación de precios entre tiendas digitales  
- 📄 Información detallada de cada juego
- 🏷️ Ofertas actualizadas periódicamente (aprox. 8h)
- 👤 Registro y sesiones de usuarios
- ⭐ Wishlist por usuario
- 🎬 Trailers y vídeos asociados a cada juego
- 📮 Notificaciones de descuentos: **En desarrollo**
- 🎚️ Filtros avanzados (precio, tienda, género, valoración…)

# 📚 Documentación Completa de la API

## 🎮 **Videojuegos y Bundles**

### `GET /api/{id}` — Obtener detalles de videojuego o bundle

Obtiene la información detallada de un videojuego o bundle con todas sus ofertas asociadas.

#### Parámetros:
- **Path Parameter:**
  - `id` (long) — ID del videojuego o bundle (requerido)

#### Respuestas:

**Videojuego - 200 OK:**
```json
{
  "Juego": {
    "id": 730,
    "imagen": "https://...",
    "imagenCapsule": "https://...",
    "nombre": "Counter-Strike 2",
    "ratingText": "Overwhelmingly Positive",
    "rating": 98,
    "lanzamiento": "2023-09-01",
    "descripcion": "Descripción larga...",
    "descripcionCorta": "Shooter competitivo...",
    "acercaDe": "Info adicional...",
    "desarrolladores": "Valve",
    "distribuidores": "Valve",
    "generos": ["Action", "Competitive"],
    "movies": [
      {
        "thumb": "https://...",
        "video": "https://..."
      }
    ],
    "capturas": [
      {
        "thumb": "https://...",
        "imagen": "https://..."
      }
    ],
    "ofertas": [
      {
        "precioOferta": 0.00,
        "ahorro": 0,
        "ofertaRating": 0,
        "tiendaIds": [1, 2]
      }
    ]
  }
}
```

**Bundle - 200 OK:**
```json
{
  "Bundle": {
    "id": 1,
    "nombre": "Bundle de Acción",
    "imagen": "https://...",
    "productos": [
      {
        "nombre": "Juego 1",
        "imagen": "https://...",
        "movies": [],
        "capturas": []
      }
    ],
    "ofertas": []
  }
}
```

**404 No Found:**
```json
{
  "error": "Videojuego o bundle no encontrado"
}
```

---

## 🏪 **Tiendas**

### `GET /api/tiendas` — Obtener todas las tiendas digitales

Lista todas las tiendas digitales disponibles con sus logos e iconos.

#### Parámetros:
- Ninguno

#### Respuesta - 200 OK:
```json
[
  {
    "nombre": "Steam",
    "logo": "https://...",
    "icon": "https://...",
    "tiendaID": 1
  },
  {
    "nombre": "Epic Games Store",
    "logo": "https://...",
    "icon": "https://...",
    "tiendaID": 2
  },
  {
    "nombre": "GOG",
    "logo": "https://...",
    "icon": "https://...",
    "tiendaID": 3
  }
]
```

**400 Bad Request:**
```json
{
  "error": "No hay tiendas registradas"
}
```

---

## 💰 **Ofertas y Precios**

### `GET /api/mayorPrecio` — Obtener precio máximo disponible

Retorna el precio más alto registrado entre todas las ofertas activas.

#### Parámetros:
- Ninguno

#### Respuesta - 200 OK:
```json
59.99
```

**400 Bad Request:**
```json
{
  "error": "No hay precios disponibles"
}
```

---

### `GET /api/ofertas` — Listado paginado de ofertas con filtros

Obtiene un listado paginado de ofertas con soporte para filtros avanzados y ordenamiento.

#### Parámetros de Query:

**Paginación (Spring Data):**
- `page` (int, default: 0) — Número de página (0-indexed)
- `size` (int, default: 20) — Cantidad de items por página
- `sort` (string) — Campo y dirección de ordenamiento. Ej: `sort=precioOferta,desc` o `sort=ahorro,asc`

**Filtros (FiltrosOfertas):**
- `titulo` (string, opcional) — Nombre del juego a buscar
- `minPrecio` (double, opcional) — Precio mínimo en USD
- `maxPrecio` (double, opcional) — Precio máximo en USD
- `minAhorro` (double, opcional) — Descuento mínimo en porcentaje
- `tiers` (string[], opcional) — Géneros del juego. Ej: `tiers=Action&tiers=RPG`
- `reviews` (string[], opcional) — Filtro por rating. Ej: `reviews=Overwhelmingly Positive&reviews=Positive`
- `inicioOferta` (LocalDateTime, opcional) — Fecha mínima de oferta. Formato: `2026-05-16T10:00:00`
- `tiendaIds` (long[], opcional) — IDs de tiendas. Ej: `tiendaIds=1&tiendaIds=2`

#### Ejemplo de Solicitud:
```
GET /api/ofertas?page=0&size=10&sort=precioOferta,asc&titulo=Counter&minPrecio=5.99&maxPrecio=29.99&tiers=Action&tiendaIds=1
```

#### Respuesta - 200 OK:
```json
{
  "content": [
    {
      "steamAppID": 730,
      "precioOferta": 0.00,
      "ahorro": 0.0,
      "ofertaRating": 0.0,
      "urlImagen": "https://...",
      "titulo": "Counter-Strike 2",
      "recent": "2026-05-16T10:30:00",
      "reviews": 98,
      "tiendaIds": [1]
    },
    {
      "steamAppID": 570,
      "precioOferta": 0.00,
      "ahorro": 25.5,
      "ofertaRating": 95.2,
      "urlImagen": "https://...",
      "titulo": "Dota 2",
      "recent": "2026-05-16T09:15:00",
      "reviews": 85,
      "tiendaIds": [1, 2]
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "empty": false,
      "unsorted": false,
      "sorted": true
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 152,
  "totalPages": 16,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "empty": false,
    "unsorted": false,
    "sorted": true
  },
  "numberOfElements": 10,
  "first": true,
  "empty": false
}
```

---

## 👤 **Usuarios**

### `POST /api/usuarios/sincronizar` — Sincronizar usuario

Sincroniza un nuevo usuario en el sistema o actualiza su registro existente.

#### Body (JSON):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@gmail.com"
}
```

#### Respuesta - 200 OK:
```json
{
  "mensaje": "Usuario sincronizado correctamente"
}
```

**400 Bad Request:**
```json
{
  "error": "Faltan datos (id o email)"
}
```

---

### `DELETE /api/usuarios/eliminar` — Eliminar cuenta

Elimina la cuenta del usuario autenticado y todos sus datos asociados (wishlist, preferencias, etc).

#### Headers:
- `Authorization` (string, requerido) — Token JWT. Formato: `Bearer eyJhbGc...`

#### Respuesta - 200 OK:
```json
{
  "mensaje": "Cuenta y datos asociados eliminados con éxito"
}
```

**401 Unauthorized:**
```json
{
  "error": "Token no válido"
}
```

---

### `GET /api/usuarios/preferencias` — Obtener preferencias de notificaciones

Obtiene el estado actual de preferencias de notificaciones del usuario.

#### Parámetros:
- **Query Parameter:**
  - `id` (UUID, requerido) — ID del usuario

#### Respuesta - 200 OK:
```json
true
```

**400 Bad Request:**
```json
{
  "error": "Error usuario no válido/existente"
}
```

---

### `PATCH /api/usuarios/preferencias` — Actualizar preferencias

Actualiza las preferencias de notificaciones del usuario.

#### Body (JSON):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "preferencia": true
}
```

#### Respuesta - 200 OK:
```json
{
  "mensaje": "Preferencia actualizada con éxito"
}
```

**404 Not Found:**
```json
{
  "error": "Usuario no encontrado"
}
```

---

## ⭐ **Wishlist / Favoritos**

### `POST /api/wishlist/toggle` — Añadir/Eliminar de wishlist

Alterna un videojuego o bundle entre la wishlist del usuario (añade si no existe, elimina si existe).

#### Headers:
- `Authorization` (string, requerido) — Token JWT. Formato: `Bearer eyJhbGc...`

#### Body (JSON):
```json
{
  "idItem": 730
}
```

#### Respuesta - 200 OK:
```json
{
  "mensaje": "Añadido a wishlist"
}
```
o
```json
{
  "mensaje": "Eliminado de wishlist"
}
```

**400 Bad Request:**
```json
{
  "error": "El ID del item es obligatorio"
}
```

---

### `DELETE /api/wishlist/eliminar/{itemId}` — Eliminar de wishlist

Elimina un item específico de la wishlist del usuario autenticado.

#### Headers:
- `Authorization` (string, requerido) — Token JWT. Formato: `Bearer eyJhbGc...`

#### Path Parameter:
- `itemId` (long, requerido) — ID del videojuego o bundle a eliminar

#### Respuesta - 200 OK:
```json
{
  "mensaje": "Eliminado correctamente"
}
```

---

### `GET /api/wishlist/mis-favoritos` — Obtener wishlist del usuario

Obtiene la lista completa de videojuegos y bundles en la wishlist del usuario autenticado.

#### Headers:
- `Authorization` (string, requerido) — Token JWT. Formato: `Bearer eyJhbGc...`

#### Respuesta - 200 OK:
```json
[
  {
    "idWishlist": 1,
    "tipo": "videojuego",
    "idItem": 730,
    "nombre": "Counter-Strike 2",
    "imagen": "https://..."
  },
  {
    "idWishlist": 2,
    "tipo": "bundle",
    "idItem": 1,
    "nombre": "Bundle de Acción",
    "imagen": "https://..."
  }
]
```

---

## 🔧 **Testing y Sincronización** (Endpoints de desarrollo)

### `GET /test/generos` — Obtener géneros (Mock)

Retorna un listado de géneros para testing.

#### Respuesta - 200 OK:
```json
["Accion", "RPG", "Indie", "Aventura"]
```

---

### `GET /test/sync-ofertas` — Forzar sincronización de ofertas

Inicia manualmente la sincronización de ofertas desde CheapShark.

#### Respuesta - 200 OK:
```json
"Sincronizacion iniciada manualmente"
```

---

### `GET /test/sync-stores` — Forzar sincronización de tiendas

Inicia manualmente la sincronización de tiendas.

#### Respuesta - 200 OK:
```json
"Sincronizacion de TIENDAS iniciada correctamente."
```

---

### `GET /test/panic` — Sincronización completa

Inicia la sincronización total de toda la base de datos.

#### Respuesta - 200 OK:
```json
"Sincronizacion de TOTAL iniciada correctamente, ahora a rezar"
```

---

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

Última actualización: 2026-05-16
