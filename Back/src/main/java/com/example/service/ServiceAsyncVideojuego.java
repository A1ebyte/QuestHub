package com.example.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.domain.model.Captura;
import com.example.domain.model.Genero;
import com.example.domain.model.Movie;
import com.example.domain.model.Oferta;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.CapturaRepository;
import com.example.domain.repository.GeneroRepository;
import com.example.domain.repository.MovieRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.steam.SteamClient;
import com.example.external.steam.SteamMapper;
import com.example.external.steam.DTOs.GenreDTO;
import com.example.external.steam.DTOs.MovieDTO;
import com.example.external.steam.DTOs.ScreenshotDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.util.TypeRefs;

import jakarta.transaction.Transactional;

@Service
public class ServiceAsyncVideojuego {

	private final SteamClient steamClient;
	private final VideojuegoRepository videojuegoRepository;
	private final MovieRepository movieRepository;
	private final GeneroRepository generoRepository;
	private final OfertaRepository ofertaRepository;
	private final CapturaRepository capturaRepository;

	private final Map<Long, Object> locks = new ConcurrentHashMap<>();

	public ServiceAsyncVideojuego(VideojuegoRepository videojuegoRepository, CapturaRepository capturaRepository,
			GeneroRepository generoRepository, MovieRepository movieRepository, OfertaRepository ofertaRepository,
			SteamClient steamClient) {
		this.steamClient = steamClient;
		this.videojuegoRepository = videojuegoRepository;
		this.movieRepository = movieRepository;
		this.generoRepository = generoRepository;
		this.ofertaRepository = ofertaRepository;
		this.capturaRepository = capturaRepository;
	}

	@Async
	public void guardarJuegoAsync(long id) {

		Object lock = locks.computeIfAbsent(id, k -> new Object());

		synchronized (lock) {

			if (videojuegoRepository.findById(id).isPresent()) {
				return;
			}

			createJuego(id);
		}
	}

	@Transactional
	public Videojuego createJuego(long id) {

		try {
			Videojuego existing = videojuegoRepository.findById(id).orElse(null);
			if (existing != null) {
				return existing;
			}

			VideojuegoSteamDTO dto = steamClient.getGame(id);
			if (dto == null) {
				return null;
			}

			Videojuego juego = generarJuego(dto);

			List<Oferta> ofertas = ofertaRepository.findBySteamAppID(id);

			for (Oferta o : ofertas) {
				juego.addOferta(o);

				if (juego.getSteamRatingText() == null || juego.getSteamRatingText().isBlank()) {
					juego.setSteamRatingPercent(o.getSteamRating());
					juego.setSteamRatingText(TypeRefs.steamReviewText(o.getSteamRating()));
				}
			}

			return videojuegoRepository.save(juego);

		} catch (DataIntegrityViolationException e) {
			return videojuegoRepository.findById(id).orElse(null);
		}
	}

	private Videojuego generarJuego(VideojuegoSteamDTO dto) {

		Videojuego juego = videojuegoRepository.findById(dto.steam_appid()).orElse(null);

		if (juego == null) {
			juego = SteamMapper.toEntity(dto);
		}

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

				Movie movie = movieRepository.findById(m.id()).orElse(null);

				if (movie == null) {
					movie = SteamMapper.toEntity(m);
					movie.setVideojuego(juego);
					movie = movieRepository.save(movie);
				}

				juego.addMovie(movie);
			}
		}

		if (dto.screenshots() != null) {
			for (ScreenshotDTO s : dto.screenshots()) {

				Captura captura = capturaRepository.findByImagen(s.path_full()).orElse(null);

				if (captura == null) {
					captura = SteamMapper.toEntity(s);
					captura.setVideojuego(juego);
					captura = capturaRepository.save(captura);
				}

				juego.addCaptura(captura);
			}
		}

		return videojuegoRepository.save(juego);
	}
}