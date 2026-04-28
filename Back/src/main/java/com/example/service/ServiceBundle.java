package com.example.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.example.api.controller.DTOs.Bundle.BundleFront;
import com.example.api.controller.mappers.FrontMapper;
import com.example.domain.model.Bundle;
import com.example.domain.model.Oferta;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.BundleRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.VideojuegoRepository;
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
	private final VideojuegoRepository videojuegoRepository;
	private final OfertaRepository ofertaRepository;

	public ServiceBundle(BundleRepository bundleRepository, SteamClient steamClient, OfertaRepository ofertaRepository,
			VideojuegoRepository videojuegoRepository,
			ServicioVideojuego servicioVideojuego, ServiceOferta serviceOferta) {
		this.servicioVideojuego = servicioVideojuego;
		this.serviceOferta = serviceOferta;
		this.bundleRepository = bundleRepository;
		this.steamClient = steamClient;
		this.ofertaRepository = ofertaRepository;
		this.videojuegoRepository = videojuegoRepository;
	}

	public BundleFront buscarPorId(long id) {
		Bundle data = bundleRepository.findById(id).orElseGet(() -> createBundle(id));
		if (data!=null)
			return FrontMapper.toDTO(data, serviceOferta);
		return null;
	}

	@Transactional
	private Bundle createBundle(long id) {

		return bundleRepository.findById(id).orElseGet(() -> {
			try {
				BundleSteamDTO dto = steamClient.getBundle(id);
				if (dto == null)
					return null;
				
				return generarBundle(dto);

			} catch (DataIntegrityViolationException e) {
				return bundleRepository.findById(id).orElse(null);
			}
		});

	}

	private Bundle generarBundle(BundleSteamDTO dto) {
		return bundleRepository.findById(dto.id()).orElseGet(() -> {
			try {
				Bundle bundle = SteamMapper.toEntity(dto);
				if (dto.apps() != null) {
					for (BundleInfoDTO info : dto.apps()) {
					    Videojuego juego = videojuegoRepository.findById(info.id())
					        .orElseGet(() -> servicioVideojuego.generarJuego(
					            steamClient.getGame(info.id())
					        ));

					    if (juego != null) {
					        bundle.addVideojuego(juego);
					    }
					}
				}
				
				List<Oferta> ofertas = ofertaRepository.findBySteamAppID(dto.id());
				if (ofertas != null) {
					for (Oferta oferta : ofertas) {
						bundle.addOferta(oferta);
						ofertaRepository.save(oferta);
					}
				}
				Bundle saved = bundleRepository.save(bundle);
				bundleRepository.flush();
				return bundleRepository.findById(saved.getIdBundle()).orElse(saved);
			} catch (DataIntegrityViolationException e) {
				return bundleRepository.findById(dto.id()).orElse(null);
			}
		});
	}
}
