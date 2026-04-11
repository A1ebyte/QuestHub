package com.example.service;

import com.example.api.controller.DTOs.FrontMapper;
import com.example.api.controller.DTOs.OfertaFront;
import com.example.api.controller.DTOs.TiendaFront;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ServiceOferta {

    private final VideojuegoRepository videojuegoRepository;
    private final OfertaRepository ofertaRepository;
    private final TiendaRepository tiendaRepository;
    private final CheapSharkClient cheapSharkClient;

    public ServiceOferta(OfertaRepository ofertaRepository, TiendaRepository tiendaRepository,
                         CheapSharkClient cheapSharkClient,
                         VideojuegoRepository videojuegoRepository) {
        this.ofertaRepository = ofertaRepository;
        this.tiendaRepository = tiendaRepository;
        this.cheapSharkClient = cheapSharkClient;
        this.videojuegoRepository = videojuegoRepository;
    }


    public Oferta obtenerOferta(String id) {

        return ofertaRepository.findByIdOferta(id);

    }

    public Page<OfertaFront> paginaDeOfertas(Pageable pageable) {
        // Usamos el pageable que viene del Controller directamente en el repository
        Page<Oferta> ofertasDeBaseDeDatos = ofertaRepository.findAll(pageable);
        // Convertimos a DTOs
        return FrontMapper.toDTOs(ofertasDeBaseDeDatos);
    }
    
    public List<TiendaFront> allTiendas() {
    	List<Tienda> lista = tiendaRepository.findAll();
        return FrontMapper.toDTOs(lista);
    }

    @Transactional
    public void guardarListaOferta(List<OfertaDTO> ofertas) {
        List<String> idsNuevos = ofertas.stream()
                .map(OfertaDTO::dealID)
                .toList();

        for (OfertaDTO ofertaDto : ofertas) {
            Oferta oferta = CheapSharkMapper.toEntity(ofertaDto);
            
            videojuegoRepository.findById(Long.valueOf(ofertaDto.steamAppID())).ifPresent(videojuego -> {
            		oferta.setVideojuego(videojuego);
            		oferta.setUrlImagen(videojuego.getImagenUrl());
            	});
            
            tiendaRepository.findById(ofertaDto.storeID()).ifPresent(oferta::setTienda);
            ofertaRepository.save(oferta);
        }

        if (!idsNuevos.isEmpty())
            ofertaRepository.deleteByIdOfertaNotIn(idsNuevos);

        System.out.println("Sync completo: " + ofertas.size() + " activas. Antiguas eliminadas.");
    }

    @Transactional
    public void guardarListaTienda(List<TiendaDTO> tiendas) {
        List<Long> idsNuevos = tiendas.stream()
                .map(TiendaDTO::storeID)
                .toList();

        for (TiendaDTO tiendaDTO : tiendas) {
            Tienda tienda = CheapSharkMapper.toEntity(tiendaDTO);
            if(tiendaRepository.findById(tiendaDTO.storeID()).isEmpty())
            	tiendaRepository.save(tienda);
        }

        if (!idsNuevos.isEmpty())
            tiendaRepository.deleteByidTiendaNotIn(idsNuevos);

        System.out.println("Sync completo: " + tiendas.size() + " activas. Antiguas eliminadas.");
    }
    
    public void tiendaExiste(List<OfertaDTO> deals) {
        Set<Long> storeIdsEnOfertas = new HashSet<>();
        for (OfertaDTO oferta : deals) {
            storeIdsEnOfertas.add(oferta.storeID());
        }

        List<Long> tiendasBD = tiendaRepository.findAllIdTienda();

        List<Long> nuevas = new ArrayList<>();
        for (Long id : storeIdsEnOfertas) {
            if (!tiendasBD.contains(id)) 
                nuevas.add(id);   
        }

        if (nuevas.isEmpty()) 
            return;
        
        System.out.println("Tiendas nuevas detectadas: " + nuevas);
        List<TiendaDTO> tiendasApi = cheapSharkClient.getStores();
        for (TiendaDTO dto : tiendasApi) {
            if (nuevas.contains(dto.storeID())) {
                Tienda nueva = CheapSharkMapper.toEntity(dto);
                tiendaRepository.save(nueva);
                System.out.println("Nueva tienda añadida: " + dto.storeName());
            }
        }
    }
}
