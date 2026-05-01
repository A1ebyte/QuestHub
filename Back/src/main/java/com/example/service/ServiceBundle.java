package com.example.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.example.api.controller.DTOs.Bundle.BundleFront;
import com.example.api.controller.mappers.FrontMapper;
import com.example.domain.model.Bundle;
import com.example.domain.model.Oferta;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.BundleRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.external.steam.SteamClient;
import com.example.external.steam.SteamMapper;
import com.example.external.steam.DTOs.BundleInfoDTO;
import com.example.external.steam.DTOs.BundleSteamDTO;

import jakarta.transaction.Transactional;

@Service
public class ServiceBundle {

	private final SteamClient steamClient;
	private final ServicioVideojuego servicioVideojuego;
	private final ServiceOferta serviceOferta;
	private final BundleRepository bundleRepository;
	private final OfertaRepository ofertaRepository;
	private final Map<Long, Object> locks = new ConcurrentHashMap<>();

	public ServiceBundle(BundleRepository bundleRepository, SteamClient steamClient, OfertaRepository ofertaRepository,
	                     ServicioVideojuego servicioVideojuego, ServiceOferta serviceOferta) {
		this.servicioVideojuego = servicioVideojuego;
		this.serviceOferta = serviceOferta;
		this.bundleRepository = bundleRepository;
		this.steamClient = steamClient;
		this.ofertaRepository = ofertaRepository;
	}

	public BundleFront buscarPorId(long id) {
		Bundle data = bundleRepository.findById(id).orElseGet(() -> createBundle(id));
		if (data!=null)
			return FrontMapper.toDTO(data, serviceOferta);
		return null;
	}

	public Bundle buscarEntidadPorId(long id) {
		return bundleRepository.findById(id).orElseGet(() -> createBundle(id));
	}

	@Transactional
	private Bundle createBundle(long id) {

		Object lock = locks.computeIfAbsent(id, k -> new Object());

		synchronized (lock) {
			try {
				Bundle existing = bundleRepository.findById(id).orElse(null);
				if (existing != null) return existing;

				BundleSteamDTO dto = steamClient.getBundle(id);
				if (dto == null) return null;

				Bundle bundle = SteamMapper.toEntity(dto);
				if (dto.apps() != null) {
					for (BundleInfoDTO info : dto.apps()) {

						Videojuego juego = servicioVideojuego.createJuego(info.id());
						if (juego != null) {
							bundle.addVideojuego(juego);
						}
					}
				}

				List<Oferta> ofertas = ofertaRepository.findBySteamAppID(dto.id());
				for (Oferta o : ofertas) {
					bundle.addOferta(o);
				}

				return bundleRepository.save(bundle);

			} catch (DataIntegrityViolationException e) {
				return bundleRepository.findById(id).orElse(null);
			} finally {
				locks.remove(id);
			}
		}
	}
}
