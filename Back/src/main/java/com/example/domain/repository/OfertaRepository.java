package com.example.domain.repository;

import com.example.domain.model.Oferta;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, String>, JpaSpecificationExecutor<Oferta> {
	Oferta findByIdOferta(String id);

	@Query("SELECT MIN(o.precioOferta) FROM Oferta o WHERE o.steamAppID = :id")
	Double findMinPrecioOferta(@Param("id") Long id);

	List<Oferta> findBySteamAppID(long id);
	
    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE oferta", nativeQuery = true)
    void truncate();
}
