package com.example.service;

import com.example.domain.model.Oferta;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceOferta {

    private final CheapSharkMapper cheapSharkMapper;
    private final OfertaRepository ofertaRepository;
    private final TiendaRepository tiendaRepository;

    public ServiceOferta(CheapSharkMapper cheapSharkMapper, OfertaRepository ofertaRepository, TiendaRepository tiendaRepository) {
        this.cheapSharkMapper = cheapSharkMapper;
        this.ofertaRepository = ofertaRepository;
        this.tiendaRepository = tiendaRepository;
    }


    public Oferta obtenerOferta(String id) {

        return ofertaRepository.findByIdOferta(id);

    }

    public void guardarListaOferta(List<OfertaDTO> oferta) {
        for (OfertaDTO ofertaDto : oferta) {
            Oferta oferta1 = cheapSharkMapper.toEntity(ofertaDto);
            oferta1.setTienda(tiendaRepository.findById(Long.valueOf(ofertaDto.storeID())).orElse(null));

            ofertaRepository.save(oferta1);
            System.out.println("se ha guarado");
        }

    }
/*
    public List<Oferta> buscarGrandesDescuentos(Double porcentajeMinimo) {

        return ofertaRepository.findByAhorrarGreaterOrderByAhorroDesc(porcentajeMinimo);
    }*/
}
