package com.example.domain.repository;

import com.example.domain.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository  extends JpaRepository<Wishlist,Long> {
    Optional<Wishlist> findByUserIdAndVideojuegoIdVideojuegos(UUID userId, Long idVideojuego);
    void deleteByUserIdAndVideojuegoIdVideojuegos(UUID userId, Long idVideojuego);
    List<Wishlist> findByUserId(UUID userId);}
