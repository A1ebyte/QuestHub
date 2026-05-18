package com.example.service;

import com.example.api.controller.DTOs.TiendaFront;
import com.example.api.controller.DTOs.ofertas.BuscadorResponseDTO;
import com.example.api.controller.DTOs.ofertas.FiltrosOfertas;
import com.example.api.controller.DTOs.ofertas.OfertasBuscadorDTO;
import com.example.api.controller.DTOs.ofertas.ViewOfertaFront;
import com.example.api.controller.mappers.FrontMapper;
import com.example.api.controller.mappers.VistaMapper;
import com.example.domain.model.Bundle;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.domain.model.Videojuego;
import com.example.domain.model.VistaOferta;
import com.example.domain.repository.BundleRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.OfertasStagingRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.domain.repository.VistaOfertaRepository;
import com.example.exceptions.BadRequestException;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.infrastructure.SwapFinishedEvent;
import com.example.util.Enums.OfferTier;
import com.example.util.Enums.Reviews;
import com.example.validation.VistaOfertaFiltros;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ServiceOferta {

	private final VideojuegoRepository videojuegoRepository;
	private final OfertaRepository ofertaRepository;
	private final OfertasStagingRepository ofertaStagingRepository;
	private final VistaOfertaRepository vistaOfertaRepository;
	private final TiendaRepository tiendaRepository;
	private final BundleRepository bundleRepository;
	private final ApplicationEventPublisher eventPublisher;
	private final CheapSharkClient cheapSharkClient;

	public ServiceOferta(OfertaRepository ofertaRepository, TiendaRepository tiendaRepository,
			CheapSharkClient cheapSharkClient, VideojuegoRepository videojuegoRepository,
			VistaOfertaRepository vistaOfertaRepository, BundleRepository bundleRepository,
			OfertasStagingRepository ofertaStagingRepository, ApplicationEventPublisher eventPublisher) {
		this.ofertaRepository = ofertaRepository;
		this.ofertaStagingRepository = ofertaStagingRepository;
		this.tiendaRepository = tiendaRepository;
		this.bundleRepository = bundleRepository;
		this.eventPublisher = eventPublisher;
		this.cheapSharkClient = cheapSharkClient;
		this.videojuegoRepository = videojuegoRepository;
		this.vistaOfertaRepository = vistaOfertaRepository;
	}
	
	@Cacheable(value = "search-ofertas", key = "#root.args[0].trim().toLowerCase()", unless = "#result == null || #result.isEmpty()")
	public BuscadorResponseDTO obtenerOfertasBuscador(String titulo){
	    String query = titulo.trim().toLowerCase();

	    List<VistaOferta> ofertas = vistaOfertaRepository.findByTituloContainingIgnoreCase(query);
		List<Videojuego> juegos = videojuegoRepository.findByNombreContainingIgnoreCase(query);
		List<Bundle> bundles = bundleRepository.findByNombreContainingIgnoreCase(query);

		Set<OfertasBuscadorDTO> resultado = new LinkedHashSet<>();

		ofertas.forEach(o -> resultado.add(new OfertasBuscadorDTO(o.getSteamAppId(),o.getTitulo(),o.getImagen())));
		juegos.forEach(j -> resultado.add(new OfertasBuscadorDTO(j.getIdVideojuego(),j.getNombre(),j.getImagenUrlResolucionBaja())));
		bundles.forEach(b -> resultado.add(new OfertasBuscadorDTO(b.getIdBundle(),b.getNombre(),b.getImagenUrl())));
		
		long total = resultado.size();

	    List<OfertasBuscadorDTO> limitados = resultado.stream()
	        .limit(5)
	        .toList();

	    return new BuscadorResponseDTO(limitados, total);
	}

	public Page<ViewOfertaFront> paginaDeOfertas(Pageable pageable) {
		Page<VistaOferta> ofertasDeBaseDeDatos = vistaOfertaRepository.findAll(pageable);
		return VistaMapper.toDTOs(ofertasDeBaseDeDatos);
	}

	public Page<ViewOfertaFront> paginaDeOfertasFiltradas(FiltrosOfertas filtros, Pageable pageable) {

		List<Long> tiendasValidas = tiendaRepository.findAllIdTienda();
		List<Long> tiendaIdsFiltradas = filtros.tiendaIds() == null ? List.of()
				: filtros.tiendaIds().stream().filter(id -> id != null && id > 0).filter(tiendasValidas::contains)
						.toList();

		List<OfferTier> tiersValidos = filtros.tiers() == null ? List.of() : filtros.tiers().stream().map(t -> {
			try {
				return OfferTier.valueOf(t);
			} catch (Exception e) {
				return null;
			}
		}).filter(Objects::nonNull).toList();

		List<Reviews> reviewsValidos = filtros.reviews() == null ? List.of() : filtros.reviews().stream().map(t -> {
			try {
				return Reviews.valueOf(t);
			} catch (Exception e) {
				return null;
			}
		}).filter(Objects::nonNull).toList();

		badRequests(filtros);

		Specification<VistaOferta> spec = Specification.where(VistaOfertaFiltros.titulo(filtros.titulo()))
				.and(VistaOfertaFiltros.minPrecio(filtros.minPrecio()))
				.and(VistaOfertaFiltros.maxPrecio(filtros.maxPrecio()))
				.and(VistaOfertaFiltros.ahorroDesde(filtros.minAhorro())).and(VistaOfertaFiltros.tiers(tiersValidos))
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

	@Cacheable(value = "tiendas", unless = "#result == null")
	public List<TiendaFront> getAllTiendas() {
		List<Tienda> lista = tiendaRepository.findAll();
		return FrontMapper.toDTOs(lista);
	}

	public void tiendaExiste(Set<OfertaDTO> deals) {

		if (deals == null || deals.isEmpty())
			return;

		Set<Long> idsDeApi = deals.stream().map(OfertaDTO::storeID).filter(Objects::nonNull)
				.collect(Collectors.toSet());

		if (idsDeApi.isEmpty())
			return;

		Set<Long> idsExistentes = new HashSet<>(tiendaRepository.findAllIdTienda());
		Set<Long> idsFaltantes = idsDeApi.stream().filter(id -> !idsExistentes.contains(id))
				.collect(Collectors.toSet());

		if (idsFaltantes.isEmpty())
			return;
		System.out.println("Tiendas nuevas detectadas: " + idsFaltantes);

		List<TiendaDTO> tiendasApi = cheapSharkClient.getStores();
		List<Tienda> nuevasTiendas = tiendasApi.stream().filter(dto -> idsFaltantes.contains(dto.storeID()))
				.map(CheapSharkMapper::toEntity).toList();

		if (!nuevasTiendas.isEmpty()) {
			tiendaRepository.saveAll(nuevasTiendas);
			nuevasTiendas.forEach(t -> System.out.println("Nueva tienda anadida: " + t.getNombre()));
		}
	}
	
	@Cacheable(value = "max-precio", unless = "#result == null")
	public Double obtenerMaxPrecio() {
		return vistaOfertaRepository.findMaxPrecioOferta();
	}

	@Transactional
	public void guardarPaginasOferta(Set<OfertaDTO> ofertas) {
		ofertaStagingRepository.truncate();

		Set<Long> ids = ofertas.stream().map(o -> Long.valueOf(o.steamAppID())).collect(Collectors.toSet());

		Set<Long> storeIds = ofertas.stream().map(OfertaDTO::storeID).collect(Collectors.toSet());

		Map<Long, Videojuego> videojuegos = videojuegoRepository.findAllById(ids).stream()
				.collect(Collectors.toMap(Videojuego::getIdVideojuego, v -> v));

		Map<Long, Bundle> bundles = bundleRepository.findAllById(ids).stream()
				.collect(Collectors.toMap(Bundle::getIdBundle, b -> b));

		Map<Long, Tienda> tiendas = tiendaRepository.findAllById(storeIds).stream()
				.collect(Collectors.toMap(Tienda::getIdTienda, t -> t));

		List<Oferta> ofertasGuardar = new ArrayList<>();

		for (OfertaDTO ofertaDto : ofertas) {
			Oferta oferta = CheapSharkMapper.toEntity(ofertaDto);

			Long id = Long.parseLong(ofertaDto.steamAppID());

			Videojuego videojuego = videojuegos.get(id);
			if (videojuego != null) {
				oferta.setVideojuego(videojuego);
				if (oferta.isCambiarImg()) {
					oferta.setThumb(videojuego.getImagenUrl());
					oferta.setCambiarImg(false);
				}
			}

			Bundle bundle = bundles.get(id);
			if (bundle != null) {
				oferta.setBundle(bundle);
				if (oferta.isCambiarImg()) {
					oferta.setThumb(bundle.getImagenUrl());
					oferta.setCambiarImg(false);
				}
			}

			Tienda tienda = tiendas.get(ofertaDto.storeID());
			if (tienda != null) {
				oferta.setTienda(tienda);
			}

			ofertasGuardar.add(oferta);
		}
		for (Oferta o : ofertasGuardar) {

			ofertaStagingRepository.upsertOferta(o.getIdOferta(), o.getSteamAppID(), o.getTitulo(), o.getPrecioOferta(),
					o.getPrecioOriginal(), o.getUrlCompra(), o.getInicioOferta(), o.getOfertaRating(), o.getAhorro(),
					o.getThumb(), o.getSteamRating(), o.isCambiarImg(),
					o.getTienda() != null ? o.getTienda().getIdTienda() : null,
					o.getVideojuego() != null ? o.getVideojuego().getIdVideojuego() : null,
					o.getBundle() != null ? o.getBundle().getIdBundle() : null);
		}
	}

	@Transactional
	public void swapOfertas() {
		ofertaRepository.truncate();
		ofertaStagingRepository.copyToOferta();
		ofertaStagingRepository.truncate();

		eventPublisher.publishEvent(new SwapFinishedEvent(this));
	}

	@Transactional
	public void guardarListaTienda(List<TiendaDTO> tiendas) {
		if (tiendas == null || tiendas.isEmpty())
			return;

		List<Long> idsApi = new ArrayList<>();
		List<Tienda> entidades = new ArrayList<>();

		for (TiendaDTO dto : tiendas) {
			idsApi.add(dto.storeID());
			entidades.add(CheapSharkMapper.toEntity(dto));
		}
		if (idsApi.isEmpty()) {
			throw new IllegalStateException("La API devolvio 0 tiendas. Abortando para evitar borrado masivo.");
		}
		tiendaRepository.deleteByIdTiendaNotIn(idsApi);
		tiendaRepository.saveAll(entidades);

		System.out.println("Sync completo: " + tiendas.size() + " tiendas activas. Antiguas eliminadas.");
	}
}
