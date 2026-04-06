package com.example.domain.repository;

import com.example.domain.model.Tienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TiendaRepository extends JpaRepository<Tienda, Long> {
    void deleteByidTiendaNotIn(List<Long> idsActivos);
    @Query("select o.tienda.id from Oferta o where o.tienda is not null")
    List<Long> findAllIdTienda();
}
