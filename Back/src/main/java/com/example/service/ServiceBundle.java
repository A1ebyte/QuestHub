package com.example.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.example.domain.model.Bundle;
import com.example.domain.model.Oferta;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.BundleRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.steam.SteamClient;
import com.example.external.steam.SteamMapper;
import com.example.external.steam.DTOs.BundleInfoDTO;
import com.example.external.steam.DTOs.BundleSteamDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.util.TypeRefs;

import jakarta.transaction.Transactional;

@Service
public class ServiceBundle {

	private final SteamClient steamClient;
	private final CheapSharkClient cheapsharkClient;
	private final ServicioVideojuego servicioVideojuego;
	private final BundleRepository bundleRepository;
	private final VideojuegoRepository videojuegoRepository;
	private final OfertaRepository ofertaRepository;

	public ServiceBundle(BundleRepository bundleRepository, SteamClient steamClient, OfertaRepository ofertaRepository,
			VideojuegoRepository videojuegoRepository, CheapSharkClient cheapsharkClient,
			ServicioVideojuego servicioVideojuego) {
		this.cheapsharkClient = cheapsharkClient;
		this.servicioVideojuego = servicioVideojuego;
		this.bundleRepository = bundleRepository;
		this.steamClient = steamClient;
		this.ofertaRepository = ofertaRepository;
		this.videojuegoRepository = videojuegoRepository;
	}

	public Bundle buscarPorId(long id) {
		Bundle data = bundleRepository.findById(id).orElseGet(() -> createBundle(id));
		if (data!=null)
			return data;
		return null;
	}

	@Transactional
	private Bundle createBundle(long id) {

		return bundleRepository.findById(id).orElseGet(() -> {
			try {
				BundleSteamDTO dto = steamClient.getBundle(id);
				if (dto == null)
					return null;

				Bundle bundle = generarBundle(dto);

				List<Oferta> ofertas = ofertaRepository.findBySteamAppID(id);
				if (ofertas != null) {
					for (Oferta oferta : ofertas) {
						bundle.addOferta(oferta);
						ofertaRepository.save(oferta);
					}
				}
				return bundleRepository.save(bundle);

			} catch (DataIntegrityViolationException e) {
				return bundleRepository.findById(id).orElse(null);
			}
		});

	}

	private Bundle generarBundle(BundleSteamDTO dto) {
		return bundleRepository.findById(dto.id()).orElseGet(() -> {
			try {
				Bundle bundle = SteamMapper.toEntity(dto);
				bundleRepository.save(bundle);
				if (dto.apps() != null) {
					for (BundleInfoDTO info : dto.apps()) {
						generarDatosCorrespondientes(bundle, info);
					}
				}
				return bundle;
			} catch (DataIntegrityViolationException e) {
				return bundleRepository.findById(dto.id()).orElse(null);
			}
		});
	}

	private void generarDatosCorrespondientes(Bundle bundle, BundleInfoDTO info) {
		Videojuego juego = videojuegoRepository.findById(info.id()).orElse(null);
		if (juego == null) {
			VideojuegoSteamDTO gameDto = steamClient.getGame(info.id());
			if (gameDto != null) {
				juego = servicioVideojuego.generarJuego(gameDto);

				List<OfertaDTO> ofertas = cheapsharkClient.obtenerOfertasJuego(gameDto.steam_appid());
				if (ofertas != null) {
					for (OfertaDTO oferta : ofertas) {
						Oferta offer = CheapSharkMapper.toEntity(oferta);
						if (ofertaRepository.findById(oferta.dealID()).isEmpty()) {
							juego.addOferta(offer);
							ofertaRepository.save(offer);
						}
						if (juego.getSteamRatingText() == null) {
							juego.setSteamRatingPercent(offer.getSteamRating());
							juego.setSteamRatingText(TypeRefs.steamReviewText(offer.getSteamRating()));
						}
					}
				}
			}
		}
		if (juego != null) {
			bundle.addVideojuego(juego);
			videojuegoRepository.save(juego);
		}
	}
}
