CREATE MATERIALIZED VIEW IF NOT EXISTS mv_ofertas_unicas AS
WITH cheapest AS (
    SELECT DISTINCT ON (o.steam_appid)
        o.steam_appid,
        o.titulo,
        o.precio_oferta,
        o.ahorro,
        o.oferta_rating,
        o.inicio_oferta AS recent,
        o.steam_rating AS reviews,
        o.thumb AS imagen
    FROM oferta o
    ORDER BY o.steam_appid, o.precio_oferta ASC, o.oferta_rating DESC
),
tiendas AS (
    SELECT 
        steam_appid,
        ',' || string_agg(DISTINCT tienda::text, ',') || ',' AS tienda_ids
    FROM oferta
    GROUP BY steam_appid
)
SELECT 
    c.steam_appid,
    c.titulo,
    c.precio_oferta,
    c.ahorro,
    c.oferta_rating,
    c.recent,
    c.reviews,
    c.imagen,
    t.tienda_ids
FROM cheapest c
JOIN tiendas t USING (steam_appid);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_ofertas_unicas_appid 
ON mv_ofertas_unicas (steam_appid);

-- 1. LIMPIEZA TOTAL
DROP TABLE IF EXISTS oferta CASCADE;
DROP TABLE IF EXISTS videojuego CASCADE;
DROP TABLE IF EXISTS genero_videojuego CASCADE;
DROP TABLE IF EXISTS genero CASCADE;
DROP TABLE IF EXISTS movie CASCADE;
DROP TABLE IF EXISTS tienda CASCADE;
DROP TABLE IF EXISTS captura CASCADE;
DROP TABLE IF EXISTS bundle CASCADE;
DROP TABLE IF EXISTS bundle_productos CASCADE;
DROP TABLE IF EXISTS bundles_videojuego CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_ofertas_unicas CASCADE;

-- 2. COMPROBACION
SELECT * FROM videojuego;
SELECT * FROM oferta order by bundle;
SELECT * FROM tienda;
SELECT * FROM genero;
SELECT * FROM genero_videojuego;
SELECT * FROM movie;
SELECT * FROM captura;
SELECT * FROM bundle;
SELECT * FROM bundle_productos;
SELECT * FROM bundles_videojuego;

SELECT * From mv_ofertas_unicas Order BY titulo desc;

SELECT count(*) FROM oferta;
SELECT COUNT(*) FROM mv_ofertas_unicas;
SELECT * FROM oferta order by oferta_rating;


SELECT o.idOferta, o.precioOferta, t.nombre 
FROM oferta o 
JOIN tienda t ON o.idTienda = t.idTienda 
LIMIT 10;