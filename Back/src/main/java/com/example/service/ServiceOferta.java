package com.example.service;

import com.example.api.controller.DTOs.FrontMapper;
import com.example.api.controller.DTOs.OfertaFront;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceOferta {

    private final OfertaRepository ofertaRepository;
    private final TiendaRepository tiendaRepository;
    private final CheapSharkClient cheapSharkClient;

    public ServiceOferta(OfertaRepository ofertaRepository, TiendaRepository tiendaRepository, CheapSharkClient cheapSharkClient) {
        this.ofertaRepository = ofertaRepository;
        this.tiendaRepository = tiendaRepository;
        this.cheapSharkClient = cheapSharkClient;
    }


    public Oferta obtenerOferta(String id) {

        return ofertaRepository.findByIdOferta(id);

    }

    public Page<OfertaFront> paginaDeOfertas(int numeroPagina, int tamanoPagina, String propiedad, String direccion) {
        Sort.Direction dir = direccion.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable paginacion = PageRequest.of(numeroPagina, tamanoPagina, Sort.by(dir, propiedad));
        Page<Oferta> ofertasDeBaseDeDatos = ofertaRepository.findAll(paginacion);

        return FrontMapper.toDTOs(ofertasDeBaseDeDatos);
    }

    @Transactional
    public void guardarListaOferta(List<OfertaDTO> ofertas) {
        List<String> idsNuevos = ofertas.stream()
                .map(OfertaDTO::dealID)
                .toList();

        for (OfertaDTO ofertaDto : ofertas) {
            Oferta oferta = CheapSharkMapper.toEntity(ofertaDto);

            tiendaRepository.findById(Long.valueOf(ofertaDto.storeID())).ifPresentOrElse(oferta::setTienda,() -> {
                Tienda tienda = CheapSharkMapper.toEntity(cheapSharkClient.getStore(Long.valueOf(ofertaDto.storeID())));
                tienda.agregarOfertas(oferta);
            });

            ofertaRepository.save(oferta);
        }

        if (!idsNuevos.isEmpty()) {
            ofertaRepository.deleteByIdOfertaNotIn(idsNuevos);
        }

        System.out.println("Sync completo: " + ofertas.size() + " activas. Antiguas eliminadas.");

    }

    @Transactional
    public void guardarListaTienda(List<TiendaDTO> tiendas) {
        List<Long> idsNuevos = tiendas.stream()
                .map(TiendaDTO::storeID)
                .toList();

        for (TiendaDTO tiendaDTO : tiendas) {
            Tienda tienda = CheapSharkMapper.toEntity(tiendaDTO);
            if(tiendaRepository.findById(Long.valueOf(tiendaDTO.storeID())).isEmpty()) {
            tiendaRepository.save(tienda);
            }
        }

        if (!idsNuevos.isEmpty()) {
            tiendaRepository.deleteByidTiendaNotIn(idsNuevos);
        }

        System.out.println("Sync completo: " + tiendas.size() + " activas. Antiguas eliminadas.");

    }
/*
    public List<Oferta> buscarGrandesDescuentos(Double porcentajeMinimo) {

        return ofertaRepository.findByAhorrarGreaterOrderByAhorroDesc(porcentajeMinimo);
    }*/
}
