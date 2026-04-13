package com.example.domain.repository;

import com.example.domain.model.Captura;
import com.example.domain.model.Movie;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Captura> findByVideo(String video);
}
