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

-- 2. TABLAS BASE (Sin dependencias)
CREATE TABLE usuario(
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE genero (
    id_genre BIGINT PRIMARY KEY, 
    descripcion TEXT
);

CREATE TABLE movie (
	id_movie BIGINT PRIMARY KEY,
	titulo TEXT,
	miniatura TEXT,
	video TEXT,
	id_videojuego BIGINT NOT NULL,
    CONSTRAINT fk_movie_videojuego
        FOREIGN KEY (id_videojuego)
        REFERENCES videojuego (id_videojuego)
        ON DELETE CASCADE
);


CREATE TABLE tienda (
    id_tienda SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    enSeguimiento BOOLEAN DEFAULT FALSE,
    logo TEXT,
    banner TEXT,
    icon TEXT
);

-- 3. TABLAS CON DEPENDENCIAS
CREATE TABLE wishlist(
    id_wishlist SERIAL PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL,
    CONSTRAINT fk_wishlist_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES usuario (id_usuario)
        ON DELETE CASCADE
);

CREATE TABLE videojuego (
    id_videojuego BIGINT PRIMARY KEY, 
    nombre VARCHAR(255) NOT NULL,
    imagen_url TEXT,
    desarolladores TEXT,
    distribuidora TEXT,
    imagen_url_resolucion_baja TEXT, 
    steam_rating_percent INTEGER,
    fecha_lanzamiento DATE,
    descripcion TEXT,
    descripcion_corta TEXT,
    acerca_de TEXT
	
);


CREATE TABLE genero_videojuego (
    id_videojuego BIGINT NOT NULL,
    id_genre BIGINT NOT NULL,
    PRIMARY KEY (id_videojuego, id_genre),
    FOREIGN KEY (id_videojuego) REFERENCES videojuego(id_videojuego) ON DELETE CASCADE,
    FOREIGN KEY (id_genre) REFERENCES genero(id_genre) ON DELETE CASCADE
);




CREATE TABLE oferta (
    id_oferta VARCHAR(255) PRIMARY KEY, 
    precio_oferta NUMERIC(10,2),
    precio_original NUMERIC(10,2),
    url_compra TEXT,
    fecha_actualizacion TIMESTAMP NULL DEFAULT NOW(),
    esta_en_oferta BOOLEAN DEFAULT FALSE, 
    oferta_rating NUMERIC(10,2),
    ahorro NUMERIC(10,2),
    url_imagen TEXT,
    id_videojuego BIGINT, -- Cambiado de INTEGER a BIGINT
    id_tienda INTEGER,
    CONSTRAINT fk_oferta_videojuego
        FOREIGN KEY (id_videojuego)
        REFERENCES videojuego (id_videojuego)
        ON DELETE CASCADE,
    CONSTRAINT fk_oferta_tienda
        FOREIGN KEY (id_tienda)
        REFERENCES tienda (id_tienda)
        ON DELETE CASCADE
);

CREATE TABLE wishlist_item (
    id_wishlist_item SERIAL PRIMARY KEY,
    id_wishlist INTEGER NOT NULL,
    id_videojuego BIGINT NOT NULL, -- Cambiado de INTEGER a BIGINT
    fecha_agregado TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_wishlist_item_wishlist
        FOREIGN KEY (id_wishlist)
        REFERENCES wishlist (id_wishlist)
        ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_item_videojuego
        FOREIGN KEY (id_videojuego)
        REFERENCES videojuego (id_videojuego)
        ON DELETE CASCADE,
    CONSTRAINT uk_wishlist_videojuego
        UNIQUE (id_wishlist, id_videojuego)
);


SELECT * FROM videojuego;
SELECT * FROM oferta;
SELECT * FROM tienda;
SELECT * FROM genero;
SELECT * FROM genero_videojuego;
SELECT * FROM movie;
SELECT * FROM captura;