package com.example.domain.repository;

import com.example.domain.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface MovieRepository extends JpaRepository<Movie, Long> {
}
