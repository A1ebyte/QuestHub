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
    @Query("SELECT w FROM Wishlist w WHERE w.userId = :userId AND w.videojuego.idVideojuego = :gameId")
    Optional<Wishlist> findByUserIdAndVideojuegoIdVideojuego(@Param("userId") UUID userId, @Param("gameId") Long gameId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.userId = :userId AND w.videojuego.idVideojuego = :gameId")
    void deleteByUserIdAndVideojuegoIdVideojuego(@Param("userId") UUID userId, @Param("gameId") Long gameId);

    List<Wishlist> findByUserId(UUID userId);

    @Query("SELECT u.email, v.nombre, o.precioOferta " +
            "FROM Wishlist w " +
            "JOIN Usuario u ON w.userId = u.idUsuario " +
            "JOIN Videojuego v ON w.videojuego.idVideojuego = v.idVideojuego " +
            "JOIN Oferta o ON v.idVideojuego = o.videojuego.idVideojuego " +
            "WHERE o.ahorro >= 50")
    List<Object[]> findEmailsAndOffersForNotification();
}