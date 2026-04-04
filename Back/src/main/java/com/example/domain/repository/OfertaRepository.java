package com.example.domain.repository;

import com.example.domain.model.Oferta;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfertaRepository extends CrudRepository<Oferta, String> {

}
