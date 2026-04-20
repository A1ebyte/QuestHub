package com.example.service;

import com.example.api.controller.DTOs.FiltrosOfertas;
import com.example.api.controller.DTOs.TiendaFront;
import com.example.api.controller.DTOs.ViewOfertaFront;
import com.example.api.controller.mappers.FrontMapper;
import com.example.api.controller.mappers.VistaMapper;
import com.example.domain.VistaOfertaFiltros;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.domain.model.VistaOferta;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.domain.repository.VistaOfertaRepository;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.infrastructure.AsyncOfertaView;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
	private final VistaOfertaRepository vistaOfertaRepository;
	private final TiendaRepository tiendaRepository;
	private final CheapSharkClient cheapSharkClient;

	public ServiceOferta(OfertaRepository ofertaRepository, TiendaRepository tiendaRepository,
			CheapSharkClient cheapSharkClient, VideojuegoRepository videojuegoRepository,
			AsyncOfertaView asyncOfertaView, VistaOfertaRepository vistaOfertaRepository) {
		this.ofertaRepository = ofertaRepository;
		this.tiendaRepository = tiendaRepository;
		this.cheapSharkClient = cheapSharkClient;
		this.videojuegoRepository = videojuegoRepository;
		this.vistaOfertaRepository = vistaOfertaRepository;
	}

	public Oferta obtenerOferta(String id) {
		return ofertaRepository.findByIdOferta(id);
	}

	public Page<ViewOfertaFront> paginaDeOfertas(Pageable pageable) {
		Page<VistaOferta> ofertasDeBaseDeDatos = vistaOfertaRepository.findAll(pageable);
		return VistaMapper.toDTOs(ofertasDeBaseDeDatos);
	}

	public Page<ViewOfertaFront> paginaDeOfertasFiltradas(FiltrosOfertas filtros, Pageable pageable) {

		Specification<VistaOferta> spec = Specification.where(VistaOfertaFiltros.titulo(filtros.titulo()))
				.and(VistaOfertaFiltros.minPrecio(filtros.minPrecio()))
				.and(VistaOfertaFiltros.maxPrecio(filtros.maxPrecio()))
				.and(VistaOfertaFiltros.minAhorro(filtros.minAhorro()))
				.and(VistaOfertaFiltros.tiers(filtros.tiers()))
				.and(VistaOfertaFiltros.minReviews(filtros.minReviews()))
				.and(VistaOfertaFiltros.inicioOferta(filtros.inicioOferta()))
				.and(VistaOfertaFiltros.tiendaIds(filtros.tiendaIds()));

		Page<VistaOferta> page = vistaOfertaRepository.findAll(spec, pageable);

		return VistaMapper.toDTOs(page);
	}

	public List<TiendaFront> allTiendas() {
		List<Tienda> lista = tiendaRepository.findAll();
		return FrontMapper.toDTOs(lista);
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
				System.out.println("Nueva tienda anadida: " + dto.storeName());
			}
		}
	}

	@Transactional
	public void guardarPaginaOferta(List<OfertaDTO> ofertas, Set<String> idsAcumulados) {

		for (OfertaDTO ofertaDto : ofertas) {
			Oferta oferta = CheapSharkMapper.toEntity(ofertaDto);

			videojuegoRepository.findById(Long.valueOf(ofertaDto.steamAppID())).ifPresent(videojuego -> {
				oferta.setVideojuego(videojuego);
				oferta.setUrlImagen(videojuego.getImagenUrl());
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
		List<Long> idsNuevos = tiendas.stream().map(TiendaDTO::storeID).toList();

		for (TiendaDTO tiendaDTO : tiendas) {
			Tienda tienda = CheapSharkMapper.toEntity(tiendaDTO);
			if (tiendaRepository.findById(tiendaDTO.storeID()).isEmpty())
				tiendaRepository.save(tienda);
		}

		if (!idsNuevos.isEmpty())
			tiendaRepository.deleteByidTiendaNotIn(idsNuevos);

		System.out.println("Sync completo: " + tiendas.size() + " activas. Antiguas eliminadas.");
	}
}
