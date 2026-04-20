package com.example.domain.repository;

import com.example.domain.model.VistaOferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface VistaOfertaRepository 
        extends JpaRepository<VistaOferta, Long>, JpaSpecificationExecutor<VistaOferta> {
    
	@Query("SELECT MAX(v.precioOferta) FROM VistaOferta v")	
	Double findMaxPrecioOferta();
}
