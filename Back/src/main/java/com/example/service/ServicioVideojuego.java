package com.example.service;

import com.example.api.controller.DTOs.Videojuego.VideojuegoFront;
import com.example.api.controller.mappers.FrontMapper;
import com.example.domain.model.*;
import com.example.domain.repository.*;
import com.example.external.steam.DTOs.GenreDTO;
import com.example.external.steam.DTOs.MovieDTO;
import com.example.external.steam.DTOs.ScreenshotDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.external.steam.SteamClient;
import com.example.external.steam.SteamMapper;
import com.example.util.TypeRefs;
import jakarta.transaction.Transactional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioVideojuego {

	private final SteamClient steamClient;
	private final ServiceOferta serviceOferta;
	private final VideojuegoRepository videojuegoRepository;
	private final MovieRepository movieRepository;
	private final GeneroRepository generoRepository;
	private final OfertaRepository ofertaRepository;
	private final CapturaRepository capturaRepository;

	public ServicioVideojuego(VideojuegoRepository videojuegoRepository, SteamClient steamClient,
			GeneroRepository generoRepository, OfertaRepository ofertaRepository, MovieRepository movieRepository,
			CapturaRepository capturaRepository, ServiceOferta serviceOferta) {
		this.serviceOferta = serviceOferta;
		this.videojuegoRepository = videojuegoRepository;
		this.movieRepository = movieRepository;
		this.steamClient = steamClient;
		this.generoRepository = generoRepository;
		this.ofertaRepository = ofertaRepository;
		this.capturaRepository = capturaRepository;
	}

	public VideojuegoFront buscarPorId(long id) {
		Videojuego data = videojuegoRepository.findById(id).orElseGet(() -> createJuego(id));
		if (data != null)
			return FrontMapper.toDTO(data, serviceOferta);
		return null;
	}

	public Videojuego buscarPorIdWishList(long id) {
		return videojuegoRepository.findById(id).orElseGet(() -> createJuego(id));
	}

	@Transactional
	private Videojuego createJuego(long id) {

		return videojuegoRepository.findById(id).orElseGet(() -> {
			try {
				VideojuegoSteamDTO dto = steamClient.getGame(id);
				if (dto == null)
					return null;

				Videojuego juego = generarJuego(dto);

				List<Oferta> ofertas = ofertaRepository.findBySteamAppID(id);
				for (Oferta o : ofertas) {
					juego.addOferta(o);
					if (juego.getSteamRatingText() == null) {
						juego.setSteamRatingPercent(o.getSteamRating());
						juego.setSteamRatingText(TypeRefs.steamReviewText(o.getSteamRating()));
					}
				}

				return videojuegoRepository.save(juego);
			} catch (DataIntegrityViolationException e) {
				return videojuegoRepository.findById(id).orElse(null);
			}
		});
	}

	public Videojuego generarJuego(VideojuegoSteamDTO dto) {
		return videojuegoRepository.findById(dto.steam_appid()).orElseGet(() -> {
			try {
				Videojuego juego = SteamMapper.toEntity(dto);
				videojuegoRepository.save(juego);

				if (dto.genres() != null) {
					for (GenreDTO g : dto.genres()) {
						Genero genero = generoRepository.findById(g.id()).orElseGet(() -> {
							try {
								return generoRepository.save(SteamMapper.toEntity(g));
							} catch (DataIntegrityViolationException e) {
								return generoRepository.findById(g.id()).orElseThrow();
							}
						});
						juego.addGenero(genero);
					}
				}

				if (dto.movies() != null) {
					for (MovieDTO m : dto.movies()) {
						Movie movie = movieRepository.findById(m.id())
								.orElseGet(() -> movieRepository.save(SteamMapper.toEntity(m)));
						juego.addMovie(movie);
					}
				}

				if (dto.screenshots() != null) {
					for (ScreenshotDTO s : dto.screenshots()) {
						Captura captura = capturaRepository.findByImagen(s.path_full())
								.orElseGet(() -> capturaRepository.save(SteamMapper.toEntity(s)));
						juego.addCaptura(captura);
					}
				}
				return juego;
			} catch (DataIntegrityViolationException e) {
				return videojuegoRepository.findById(dto.steam_appid()).orElse(null);
			}
		});
	}
}
