package com.example.service.videojuego;

import com.example.api.controller.DTOs.VideojuegoFront;
import com.example.api.controller.mappers.FrontMapper;
import com.example.domain.model.*;
import com.example.domain.repository.*;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.external.steam.SteamClient;
import com.example.util.TypeRefs;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioVideojuego {

	private final SteamClient steamClient;
	private final ServiceAsyncVideojuego serviceAsyncVideojuego;
	private final VideojuegoRepository videojuegoRepository;
	private final OfertaRepository ofertaRepository;

	public ServicioVideojuego(VideojuegoRepository videojuegoRepository, SteamClient steamClient,
			OfertaRepository ofertaRepository, ServiceAsyncVideojuego serviceAsyncVideojuego) {
		this.serviceAsyncVideojuego = serviceAsyncVideojuego;
		this.videojuegoRepository = videojuegoRepository;
		this.steamClient = steamClient;
		this.ofertaRepository = ofertaRepository;
	}

	public VideojuegoFront buscarPorId(long id) {
		Videojuego data = videojuegoRepository.findById(id).orElse(null);
		if (data != null) {
			return FrontMapper.toDTO(data);
		}
		VideojuegoSteamDTO steamDto = steamClient.getGame(id);

		if (steamDto == null) {
			return null;
		}

		serviceAsyncVideojuego.guardarJuegoAsync(id);

		List<Oferta> ofertas = ofertaRepository.findBySteamAppID(id);
		String txtRate = !ofertas.isEmpty() ? TypeRefs.steamReviewText(ofertas.get(0).getSteamRating())
				: "Por Determinar...";
		Integer rate = !ofertas.isEmpty() ? ofertas.get(0).getSteamRating() : 0;
		System.out.println("Guardado Async");
		return FrontMapper.toDTO(steamDto, ofertas, txtRate, rate);
	}

	public Videojuego buscarPorIdWishList(long id) {
		return videojuegoRepository.findById(id).orElseGet(() -> serviceAsyncVideojuego.createJuego(id));
	}
}
