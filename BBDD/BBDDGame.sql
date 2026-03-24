CREATE TABLE usuario(
	id_usuario SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash TEXT NOT NULL
);

CREATE TABLE wishlist(
	id_wishlist SERIAL PRIMARY KEY,
	id_usuario INTEGER UNIQUE NOT NULL,
	CONSTRAINT fk_wishlist_usuario
		FOREIGN KEY(id_usuario)
		REFERENCES usuario (id_usuario)
		ON DELETE CASCADE
);

CREATE TABLE videojuego (
	id_videojuego SERIAL PRIMARY KEY,
	imagen_url TEXT,
	nombre VARCHAR(255) NOT NULL,
	rating NUMERIC (3,1),
	fecha_lanzamiento DATE,
	genero VARCHAR(100),
	descripcion TEXT
);

CREATE TABLE tienda (
	id_tienda SERIAL PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	logo TEXT
);

CREATE TABLE oferta (
	id_oferta SERIAL PRIMARY KEY,
	precio_actual NUMERIC(10,2) NOT NULL,
	precio_original NUMERIC(10,2),
	url_compra TEXT NOT NULL,
	fecha_actualizacion TIMESTAMP NULL DEFAULT NOW(),
	id_videojuego INTEGER NOT NULL,
	id_tienda INTEGER NOT NULL,
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
	id_videojuego INTEGER NOT NULL,
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

