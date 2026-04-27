package com.example.service;

import com.example.api.controller.DTOs.FiltrosOfertas;
import com.example.api.controller.DTOs.TiendaFront;
import com.example.api.controller.DTOs.ViewOfertaFront;
import com.example.api.controller.mappers.FrontMapper;
import com.example.api.controller.mappers.VistaMapper;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.domain.model.VistaOferta;
import com.example.domain.repository.BundleRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.domain.repository.VistaOfertaRepository;
import com.example.exceptions.BadRequestException;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.util.Enums.OfferTier;
import com.example.util.Enums.Reviews;
import com.example.validation.VistaOfertaFiltros;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ServiceOferta {

	private final VideojuegoRepository videojuegoRepository;
	private final OfertaRepository ofertaRepository;
	private final VistaOfertaRepository vistaOfertaRepository;
	private final TiendaRepository tiendaRepository;
	private final BundleRepository bundleRepository;
	private final CheapSharkClient cheapSharkClient;

	public ServiceOferta(OfertaRepository ofertaRepository, TiendaRepository tiendaRepository,
			CheapSharkClient cheapSharkClient, VideojuegoRepository videojuegoRepository,
			VistaOfertaRepository vistaOfertaRepository, BundleRepository bundleRepository) {
		this.ofertaRepository = ofertaRepository;
		this.tiendaRepository = tiendaRepository;
		this.bundleRepository = bundleRepository;
		this.cheapSharkClient = cheapSharkClient;
		this.videojuegoRepository = videojuegoRepository;
		this.vistaOfertaRepository = vistaOfertaRepository;
	}

	public Oferta obtenerOferta(String id) {
		return ofertaRepository.findByIdOferta(id);
	}
	
	public Double obtenerOfertaMasBarata(long id) {
		return ofertaRepository.findMinPrecioOferta(id);
	}

	public Page<ViewOfertaFront> paginaDeOfertas(Pageable pageable) {
		Page<VistaOferta> ofertasDeBaseDeDatos = vistaOfertaRepository.findAll(pageable);
		return VistaMapper.toDTOs(ofertasDeBaseDeDatos);
	}

	public Page<ViewOfertaFront> paginaDeOfertasFiltradas(FiltrosOfertas filtros, Pageable pageable) {
		
		List<Long> tiendasValidas = tiendaRepository.findAllIdTienda();
		List<Long> tiendaIdsFiltradas = filtros.tiendaIds() == null ? List.of() : filtros.tiendaIds().stream()
				.filter(id -> id != null && id > 0)
		        .filter(tiendasValidas::contains)
		        .toList();
		
		
		List<OfferTier> tiersValidos = filtros.tiers() == null ? List.of() : filtros.tiers().stream()
		        .map(t -> { try { return OfferTier.valueOf(t); } catch (Exception e) { return null; }})
		        .filter(Objects::nonNull)
		        .toList();
		
		List<Reviews> reviewsValidos = filtros.reviews() == null ? List.of() : filtros.reviews().stream()
		        .map(t -> { try { return Reviews.valueOf(t); } catch (Exception e) { return null; }})
		        .filter(Objects::nonNull)
		        .toList();
		
		badRequests(filtros);
		
		Specification<VistaOferta> spec = Specification.where(VistaOfertaFiltros.titulo(filtros.titulo()))
				.and(VistaOfertaFiltros.minPrecio(filtros.minPrecio()))
				.and(VistaOfertaFiltros.maxPrecio(filtros.maxPrecio()))
				.and(VistaOfertaFiltros.ahorroDesde(filtros.minAhorro()))
				.and(VistaOfertaFiltros.tiers(tiersValidos))
				.and(VistaOfertaFiltros.minReviews(reviewsValidos))
				.and(VistaOfertaFiltros.inicioOferta(filtros.inicioOferta()))
				.and(VistaOfertaFiltros.tiendaIds(tiendaIdsFiltradas));

		Page<VistaOferta> page = vistaOfertaRepository.findAll(spec, pageable);

		return VistaMapper.toDTOs(page);
	}

	private void badRequests(FiltrosOfertas filtros) {
		if (filtros.titulo() != null && filtros.titulo().length() > 200)
			throw new BadRequestException("El titulo no puede tener mas de 200 chars");		
		
		if (filtros.tiers() != null && filtros.tiers().size() > 5)
			throw new BadRequestException("Demasiados tiers enviados");
		
		if (filtros.tiendaIds() != null && filtros.tiendaIds().size() > 30)
			throw new BadRequestException("Demasiados tiers enviados");
		
		if (filtros.reviews() != null && filtros.reviews().size() > 6)
			throw new BadRequestException("Demasiados reviews enviados");
		
		if (filtros.minPrecio() != null && filtros.minPrecio() < 0)
		    throw new BadRequestException("El precio minimo no puede ser negativo");

		if (filtros.maxPrecio() != null && filtros.maxPrecio() < 0)
		    throw new BadRequestException("El precio maximo no puede ser negativo");
		
		if (filtros.maxPrecio() != null && filtros.minPrecio() != null && filtros.maxPrecio() < filtros.minPrecio())
		    throw new BadRequestException("El precio maximo no puede ser menor que el min precio");

		if (filtros.minAhorro() != null && (filtros.minAhorro() < 0 || filtros.minAhorro() > 100))
		    throw new BadRequestException("El ahorro debe estar entre 0 y 100");
	}

	public List<TiendaFront> getAllTiendas() {
		List<Tienda> lista = tiendaRepository.findAll();
		return FrontMapper.toDTOs(lista);
	}

	public void tiendaExiste(List<OfertaDTO> deals) {

	    if (deals == null || deals.isEmpty()) return;
	    
	    Set<Long> idsDeApi = deals.stream()
	            .map(OfertaDTO::storeID)
	            .filter(Objects::nonNull)
	            .collect(Collectors.toSet());

	    if (idsDeApi.isEmpty()) return;
	    
	    Set<Long> idsExistentes = new HashSet<>(tiendaRepository.findAllIdTienda());
	    Set<Long> idsFaltantes = idsDeApi.stream()
	            .filter(id -> !idsExistentes.contains(id))
	            .collect(Collectors.toSet());

	    if (idsFaltantes.isEmpty()) return;
	    System.out.println("Tiendas nuevas detectadas: " + idsFaltantes);

	    List<TiendaDTO> tiendasApi = cheapSharkClient.getStores();
	    List<Tienda> nuevasTiendas = tiendasApi.stream()
	            .filter(dto -> idsFaltantes.contains(dto.storeID()))
	            .map(CheapSharkMapper::toEntity)
	            .toList();

	    if (!nuevasTiendas.isEmpty()) {
	        tiendaRepository.saveAll(nuevasTiendas);
	        nuevasTiendas.forEach(t ->
	                System.out.println("Nueva tienda añadida: " + t.getNombre())
	        );
	    }
	}

	@Transactional
	public void guardarPaginaOferta(List<OfertaDTO> ofertas, Set<String> idsAcumulados) {

		for (OfertaDTO ofertaDto : ofertas) {
			Oferta oferta = CheapSharkMapper.toEntity(ofertaDto);

			videojuegoRepository.findById(Long.valueOf(ofertaDto.steamAppID())).ifPresent(videojuego -> {
				oferta.setVideojuego(videojuego);
				if(oferta.isCambiarImg()) {
					oferta.setThumb(videojuego.getImagenUrl());
					oferta.setCambiarImg(false);
				}
				});
			bundleRepository.findById(Long.valueOf(ofertaDto.steamAppID())).ifPresent(bundle -> {
				oferta.setBundle(bundle);
				if(oferta.isCambiarImg()) {
					oferta.setThumb(bundle.getImagenUrl());
					oferta.setCambiarImg(false);
				}
				});
			tiendaRepository.findById(ofertaDto.storeID()).ifPresent(oferta::setTienda);
			ofertaRepository.save(oferta);
			idsAcumulados.add(ofertaDto.dealID());
		}
	}

	@Transactional
	public void eliminarOfertasAntiguas(Set<String> idsValidos) {
		ofertaRepository.deleteByIdOfertaNotIn(idsValidos.stream().toList());
	}

	@Transactional
	public void guardarListaTienda(List<TiendaDTO> tiendas) {
	    if (tiendas == null || tiendas.isEmpty()) return;

	    List<Long> idsApi = new ArrayList<>();
	    List<Tienda> entidades = new ArrayList<>();

	    for (TiendaDTO dto : tiendas) {
	        idsApi.add(dto.storeID());
	        entidades.add(CheapSharkMapper.toEntity(dto));
	    }

	    tiendaRepository.deleteByidTiendaNotIn(idsApi);
	    tiendaRepository.saveAll(entidades);

	    System.out.println("Sync completo: " + tiendas.size() + " tiendas activas. Antiguas eliminadas.");
	}
}




