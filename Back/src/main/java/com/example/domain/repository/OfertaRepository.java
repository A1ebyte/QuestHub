package com.example.domain.repository;

import com.example.domain.model.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, String> {
    Oferta findByIdOferta(String id);
    void deleteByIdOfertaNotIn(List<String> idsActivos);
}
