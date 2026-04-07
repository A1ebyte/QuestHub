package com.example.domain.repository;

import com.example.domain.model.Tienda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TiendaRepository extends JpaRepository<Tienda, Long> {
    void deleteByidTiendaNotIn(List<Long> idsActivos);
    List<Long> findAllByIdTiendaNotNull();
}
