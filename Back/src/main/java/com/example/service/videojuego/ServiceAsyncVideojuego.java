package com.example.service.videojuego;

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
import com.example.domain.repository.GeneroRepository;
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
	private final GeneroRepository generoRepository;
	private final OfertaRepository ofertaRepository;

	private final Map<Long, Object> locks = new ConcurrentHashMap<>();

	public ServiceAsyncVideojuego(VideojuegoRepository videojuegoRepository, GeneroRepository generoRepository,
			OfertaRepository ofertaRepository, SteamClient steamClient) {
		this.steamClient = steamClient;
		this.videojuegoRepository = videojuegoRepository;
		this.generoRepository = generoRepository;
		this.ofertaRepository = ofertaRepository;
	}

	@Async("gameExecutor")
	public void guardarJuegoAsync(long id) {

		Object lock = locks.computeIfAbsent(id, k -> new Object());

		synchronized (lock) {

			if (videojuegoRepository.findById(id).isPresent()) {
				return;
			}

			try {
				createJuego(id);

			} finally {
				locks.remove(id);
			}
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

			if (ofertas != null && !ofertas.isEmpty()) {
				if (juego.getSteamRatingText() == null || juego.getSteamRatingText().isBlank()) {
					juego.setSteamRatingPercent(ofertas.get(0).getSteamRating());
					juego.setSteamRatingText(TypeRefs.steamReviewText(ofertas.get(0).getSteamRating()));
				}
				juego.setOnSale(true);
			}

			for (Oferta offer : ofertas) {
				juego.addOferta(offer);
			}

			return videojuegoRepository.save(juego);
		} catch (DataIntegrityViolationException e) {
			return videojuegoRepository.findById(id).orElseThrow();
		}
	}

	private Videojuego generarJuego(VideojuegoSteamDTO dto) {

		Videojuego juego = videojuegoRepository.findById(dto.steam_appid()).orElseGet(() -> SteamMapper.toEntity(dto));

		if (dto.genres() != null) {
			for (GenreDTO g : dto.genres()) {

				Genero genero = generoRepository.findById(g.id()).orElseGet(() -> {
					return generoRepository.save(SteamMapper.toEntity(g));
				});

				juego.addGenero(genero);
			}
		}

		if (dto.movies() != null) {
			for (MovieDTO m : dto.movies()) {
				Movie newMovie = SteamMapper.toEntity(m);
				juego.addMovie(newMovie);
			}
		}

		if (dto.screenshots() != null) {
			for (ScreenshotDTO s : dto.screenshots()) {
				Captura captura = SteamMapper.toEntity(s);
				juego.addCaptura(captura);
			}
		}

		return videojuegoRepository.save(juego);
	}
}