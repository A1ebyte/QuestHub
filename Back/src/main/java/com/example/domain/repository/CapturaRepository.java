package com.example.domain.repository;

import com.example.domain.model.Captura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CapturaRepository extends JpaRepository<Captura,Long> {
}
