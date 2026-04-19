-- 1. LIMPIEZA TOTAL
DROP TABLE IF EXISTS oferta CASCADE;
DROP TABLE IF EXISTS videojuego CASCADE;
DROP TABLE IF EXISTS genero_videojuego CASCADE;
DROP TABLE IF EXISTS genero CASCADE;
DROP TABLE IF EXISTS movie CASCADE;
DROP TABLE IF EXISTS tienda CASCADE;
DROP TABLE IF EXISTS captura CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_ofertas_unicas CASCADE;

-- 2. COMPROBACION
SELECT * FROM videojuego;
SELECT * FROM oferta;
SELECT * FROM tienda;
SELECT * FROM genero;
SELECT * FROM genero_videojuego;
SELECT * FROM movie;
SELECT * FROM captura;
SELECT * From mv_ofertas_unicas Order BY titulo desc;

SELECT count(*) FROM oferta;
SELECT COUNT(*) FROM mv_ofertas_unicas;


SELECT o.idOferta, o.precioOferta, t.nombre 
FROM oferta o 
JOIN tienda t ON o.idTienda = t.idTienda 
LIMIT 10;