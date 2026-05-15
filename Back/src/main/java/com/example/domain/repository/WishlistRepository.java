package com.example.domain.repository;

import com.example.domain.model.Wishlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

	Optional<Wishlist> findByUsuario_IdUsuario(UUID userId);

	@Query(value = """
			(SELECT u.email, v.nombre, o.precio_oferta, v.id_videojuego, 'JUEGO' as tipo
			 FROM wishlist w
			 JOIN usuario u ON w.user_id = u.id_usuario
			 JOIN wishlist_videojuegos wv ON w.id_wishlist = wv.id_wishlist
			 JOIN videojuego v ON wv.id_videojuego = v.id_videojuego
			 JOIN oferta o ON v.id_videojuego = o.videojuego
			 WHERE o.inicio_oferta >= :fechaReferencia
			     AND u.recibir_notificaciones = true)

			UNION ALL

			(SELECT u.email, b.nombre, o.precio_oferta, b.id_bundle, 'BUNDLE' as tipo
			 FROM wishlist w
			 JOIN usuario u ON w.user_id = u.id_usuario
			 JOIN wishlist_bundles wb ON w.id_wishlist = wb.id_wishlist
			 JOIN bundle b ON wb.id_bundle = b.id_bundle
			 JOIN oferta o ON b.id_bundle = o.bundle
			 WHERE o.inicio_oferta >= :fechaReferencia
			     AND u.recibir_notificaciones = true)
			""", nativeQuery = true)
	List<Object[]> findEmailsAndOffersForNotification(@Param("fechaReferencia") LocalDateTime fechaReferencia);
}