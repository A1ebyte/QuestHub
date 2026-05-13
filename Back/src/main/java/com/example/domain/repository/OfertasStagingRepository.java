package com.example.domain.repository;

import com.example.domain.model.OfertaStaging;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OfertasStagingRepository extends JpaRepository<OfertaStaging, String>, JpaSpecificationExecutor<OfertaStaging> {
	OfertaStaging findByIdOferta(String id);

	@Query("SELECT MIN(o.precioOferta) FROM Oferta o WHERE o.steamAppID = :id")
	Double findMinPrecioOferta(@Param("id") Long id);

	List<OfertaStaging> findBySteamAppID(long id);

	void deleteByIdOfertaNotIn(List<String> idsActivos);
	
    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE oferta_staging", nativeQuery = true)
    void truncate();
    
    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO oferta (
            id_oferta,
            steam_appid,
            titulo,
            precio_oferta,
            precio_original,
            url_compra,
            inicio_oferta,
            oferta_rating,
            ahorro,
            thumb,
            steam_rating,
            cambiar_img,
            tienda,
            videojuego,
            bundle
        )
        SELECT
            id_oferta,
            steam_appid,
            titulo,
            precio_oferta,
            precio_original,
            url_compra,
            inicio_oferta,
            oferta_rating,
            ahorro,
            thumb,
            steam_rating,
            cambiar_img,
            tienda,
            videojuego,
            bundle
        FROM oferta_staging
    """, nativeQuery = true)
    void copyToOferta();

	@Modifying
	@Transactional
	@Query(value = """
			INSERT INTO oferta_staging (
			  id_oferta,
			  steam_appid,
			  titulo,
			  precio_oferta,
			  precio_original,
			  url_compra,
			  inicio_oferta,
			  oferta_rating,
			  ahorro,
			  thumb,
			  steam_rating,
			  cambiar_img,
			  tienda,
			  videojuego,
			  bundle
			)
			VALUES (
			  :idOferta,
			  :steamAppID,
			  :titulo,
			  :precioOferta,
			  :precioOriginal,
			  :urlCompra,
			  :inicioOferta,
			  :ofertaRating,
			  :ahorro,
			  :thumb,
			  :steamRating,
			  :cambiarImg,
			  :tienda,
			  :videojuego,
			  :bundle
			)
			ON CONFLICT (id_oferta)
			DO UPDATE SET
			  steam_appid = EXCLUDED.steam_appid,
			  titulo = EXCLUDED.titulo,
			  precio_oferta = EXCLUDED.precio_oferta,
			  precio_original = EXCLUDED.precio_original,
			  url_compra = EXCLUDED.url_compra,
			  inicio_oferta = EXCLUDED.inicio_oferta,
			  oferta_rating = EXCLUDED.oferta_rating,
			  ahorro = EXCLUDED.ahorro,
			  thumb = EXCLUDED.thumb,
			  steam_rating = EXCLUDED.steam_rating,
			  cambiar_img = EXCLUDED.cambiar_img,
			  tienda = EXCLUDED.tienda,
			  videojuego = EXCLUDED.videojuego,
			  bundle = EXCLUDED.bundle
			""", nativeQuery = true)
	void upsertOferta(@Param("idOferta") String idOferta, @Param("steamAppID") long steamAppID,
			@Param("titulo") String titulo, @Param("precioOferta") double precioOferta,
			@Param("precioOriginal") double precioOriginal, @Param("urlCompra") String urlCompra,
			@Param("inicioOferta") LocalDateTime inicioOferta, @Param("ofertaRating") double ofertaRating,
			@Param("ahorro") double ahorro, @Param("thumb") String thumb, @Param("steamRating") int steamRating,
			@Param("cambiarImg") boolean cambiarImg, @Param("tienda") Long tienda, @Param("videojuego") Long videojuego,
			@Param("bundle") Long bundle);
}
