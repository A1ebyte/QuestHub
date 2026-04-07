-- 1. LIMPIEZA TOTAL
DROP TABLE IF EXISTS wishlist_item CASCADE;
DROP TABLE IF EXISTS oferta CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS videojuego CASCADE; -- Borrar esto antes que genero
DROP TABLE IF EXISTS genero_videojuego CASCADE;
DROP TABLE IF EXISTS genero CASCADE;
DROP TABLE IF EXISTS movie CASCADE;
DROP TABLE IF EXISTS tienda CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS captura CASCADE;

-- 2. COMPROBACION
SELECT * FROM videojuego;
SELECT * FROM oferta;
SELECT * FROM tienda;
SELECT * FROM genero;
SELECT * FROM genero_videojuego;
SELECT * FROM movie;
SELECT * FROM captura;

SELECT count(*) FROM oferta;

SELECT o.idOferta, o.precioOferta, t.nombre 
FROM oferta o 
JOIN tienda t ON o.idTienda = t.idTienda 
LIMIT 10;

/*No Usar El back las generas automaticamente*/
/*
-- 2. TABLAS BASE (Sin dependencias)
CREATE TABLE usuario(
    idUsuario SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL
);

CREATE TABLE genero (
    idGenre BIGINT PRIMARY KEY, 
    descripcion TEXT
);

CREATE TABLE movie (
	idMovie BIGINT PRIMARY KEY,
	titulo TEXT,
	miniatura TEXT,
	video TEXT,
	idVideojuego BIGINT NOT NULL,
    CONSTRAINT fk_movieVideojuego
        FOREIGN KEY (idVideojuego)
        REFERENCES videojuego (idVideojuego)
        ON DELETE CASCADE
);


CREATE TABLE tienda (
    idTienda SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    enSeguimiento BOOLEAN DEFAULT FALSE,
    logo TEXT,
    banner TEXT,
    icon TEXT
);

-- 3. TABLAS CON DEPENDENCIAS
CREATE TABLE wishlist(
    idWishlist SERIAL PRIMARY KEY,
    idUsuario INTEGER UNIQUE NOT NULL,
    CONSTRAINT fk_wishlist_usuario
        FOREIGN KEY(idUsuario)
        REFERENCES usuario (idUsuario)
        ON DELETE CASCADE
);

CREATE TABLE videojuego (
    idVideojuego BIGINT PRIMARY KEY, 
    nombre VARCHAR(255) NOT NULL,
    imagenUrl TEXT,
    desarolladores TEXT,
    distribuidora TEXT,
    imagenUrlResolucionBaja TEXT, 
    steamRatingPercent INTEGER,
    fechaLanzamiento DATE,
    descripcion TEXT,
    descripcionCorta TEXT,
    acercaDe TEXT
	
);


CREATE TABLE genero_videojuego (
    idVideojuego BIGINT NOT NULL,
    idGenre BIGINT NOT NULL,
    PRIMARY KEY (idVideojuego, idGenre),
    FOREIGN KEY (idVideojuego) REFERENCES videojuego(idVideojuego) ON DELETE CASCADE,
    FOREIGN KEY (idGenre) REFERENCES genero(idGenre) ON DELETE CASCADE
);




CREATE TABLE oferta (
    idOferta VARCHAR(255) PRIMARY KEY, 
    precioOferta NUMERIC(10,2),
    precioOriginal NUMERIC(10,2),
    urlCompra TEXT,
    fechaActualizacion TIMESTAMP NULL DEFAULT NOW(),
    estaEnOferta BOOLEAN DEFAULT FALSE, 
    ofertaRating NUMERIC(10,2),
    ahorro NUMERIC(10,2),
    urlImagen TEXT,
    idVideojuego BIGINT, -- Cambiado de INTEGER a BIGINT
    idTienda INTEGER,
	steamRating INTEGER,
    CONSTRAINT fk_oferta_videojuego
        FOREIGN KEY (idVideojuego)
        REFERENCES videojuego (idVideojuego)
        ON DELETE CASCADE,
    CONSTRAINT fk_oferta_tienda
        FOREIGN KEY (idTienda)
        REFERENCES tienda (idTienda)
        ON DELETE CASCADE
);

CREATE TABLE wishlist_item (
    idWishlistItem SERIAL PRIMARY KEY,
    idWishlist INTEGER NOT NULL,
    idVideojuego BIGINT NOT NULL, -- Cambiado de INTEGER a BIGINT
    fechaAgregado TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_wishlist_item_wishlist
        FOREIGN KEY (idWishlist)
        REFERENCES wishlist (idWishlist)
        ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_item_videojuego
        FOREIGN KEY (idVideojuego)
        REFERENCES videojuego (idVideojuego)
        ON DELETE CASCADE,
    CONSTRAINT ukWishlistVideojuego
        UNIQUE (idWishlist, idVideojuego)
);
*/