package com.example.domain.repository;

import org.springframework.stereotype.Repository;
import com.example.domain.model.VistaOferta;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface VistaOfertaRepository extends JpaRepository<VistaOferta, Long> {

}
