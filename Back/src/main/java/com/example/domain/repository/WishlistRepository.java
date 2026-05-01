package com.example.domain.repository;

import com.example.domain.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    @Query("SELECT w FROM Wishlist w JOIN w.videojuegos v WHERE w.userId = :userId AND v.idVideojuego = :gameId")
    Optional<Wishlist> findByUserIdAndVideojuegos_IdVideojuego(@Param("userId") UUID userId, @Param("gameId") Long gameId);

    @Query("SELECT w FROM Wishlist w JOIN w.bundles b WHERE w.userId = :userId AND b.idBundle = :bundleId")
    Optional<Wishlist> findByUserIdAndBundles_IdBundle(@Param("userId") UUID userId, @Param("bundleId") Long bundleId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.userId = :userId AND :gameId IN (SELECT v.idVideojuego FROM w.videojuegos v)")
    void eliminarVideojuegoDeWishlist(@Param("userId") UUID userId, @Param("gameId") Long gameId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.userId = :userId AND :bundleId IN (SELECT b.idBundle FROM w.bundles b)")
    void eliminarBundleDeWishlist(@Param("userId") UUID userId, @Param("bundleId") Long bundleId);

    List<Wishlist> findByUserId(UUID userId);

    @Query(value = """
    (SELECT u.email, v.nombre, o.precio_oferta, v.id_videojuego, 'JUEGO' as tipo
     FROM wishlist w
     JOIN usuario u ON w.user_id = u.id_usuario
     JOIN wishlist_videojuegos wv ON w.id_wishlist = wv.id_wishlist
     JOIN videojuego v ON wv.id_videojuego = v.id_videojuego
     JOIN oferta o ON v.id_videojuego = o.videojuego
     WHERE o.ahorro >= 50)
    UNION ALL
    (SELECT u.email, b.nombre, o.precio_oferta, b.id_bundle, 'BUNDLE' as tipo
     FROM wishlist w
     JOIN usuario u ON w.user_id = u.id_usuario
     JOIN wishlist_bundles wb ON w.id_wishlist = wb.id_wishlist
     JOIN bundle b ON wb.id_bundle = b.id_bundle
     JOIN oferta o ON b.id_bundle = o.bundle
     WHERE o.ahorro >= 50)
    """, nativeQuery = true)
    List<Object[]> findEmailsAndOffersForNotification();

    @Query("SELECT DISTINCT w FROM Wishlist w " +
            "LEFT JOIN FETCH w.videojuegos v " +
            "LEFT JOIN FETCH w.bundles b " +
            "WHERE w.userId = :userId")
    List<Wishlist> findByUserIdWithDetails(@Param("userId") UUID userId);
}
