package com.example.service.bundle;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.domain.model.Bundle;
import com.example.domain.model.BundleProductos;
import com.example.domain.model.Oferta;
import com.example.domain.repository.BundleRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.external.steam.SteamClient;
import com.example.external.steam.SteamMapper;
import com.example.external.steam.DTOs.BundleInfoDTO;
import com.example.external.steam.DTOs.BundleSteamDTO;
import com.example.external.steam.DTOs.CapturaPreview;
import com.example.external.steam.DTOs.MovieDTO;
import com.example.external.steam.DTOs.MoviePreview;
import com.example.external.steam.DTOs.ScreenshotDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;

import jakarta.transaction.Transactional;

@Service
public class ServiceAsyncBundle {
	private final SteamClient steamClient;
	private final BundleRepository bundleRepository;
	private final OfertaRepository ofertaRepository;
	private final Map<Long, Object> locks = new ConcurrentHashMap<>();

	public ServiceAsyncBundle(BundleRepository bundleRepository, SteamClient steamClient,
			OfertaRepository ofertaRepository) {
		this.bundleRepository = bundleRepository;
		this.steamClient = steamClient;
		this.ofertaRepository = ofertaRepository;
	}

	@Async("gameExecutor")
	public void guardarBundleAsync(long id) {

		Object lock = locks.computeIfAbsent(id, k -> new Object());

		synchronized (lock) {

			if (bundleRepository.findById(id).isPresent()) {
				return;
			}

			try {
				createBundle(id);

			} finally {
				locks.remove(id);
			}
		}
	}

	@Transactional
	public Bundle createBundle(long id) {
		try {
			Bundle existing = bundleRepository.findById(id).orElse(null);
			if (existing != null) {
				return existing;
			}

			BundleSteamDTO dto = steamClient.getBundle(id);
			if (dto == null) {
				return null;
			}

			Bundle bundle = SteamMapper.toEntity(dto);
			
			bundle = bundleRepository.save(bundle);

			if (dto.apps() != null) {
				for (BundleInfoDTO info : dto.apps()) {

					VideojuegoSteamDTO video = steamClient.getGame(info.id());
					BundleProductos prod = SteamMapper.toEntity(info);
					if (video != null) {
						String txt = video.short_description().isBlank() ? video.about_the_game()
								: video.short_description();
						prod.setImagenUrl(video.capsule_image());
						prod.setDescripcion(txt);
						if (video.movies() != null) {
							for (MovieDTO m : video.movies()) {
								MoviePreview newMovie = new MoviePreview();
								newMovie.setMiniatura(m.thumbnail());
								newMovie.setVideo(m.hls_h264());
								prod.addMovies(newMovie);
							}
						}
						if (video.screenshots() != null) {
							for (ScreenshotDTO s : video.screenshots()) {
								CapturaPreview captura = new CapturaPreview();
								captura.setImagen(s.path_full());
								captura.setMiniatura(s.path_thumbnail());
								prod.addCapturas(captura);
							}
						}
					}
					bundle.addProductos(prod);

				}
			}

			List<Oferta> ofertas = ofertaRepository.findBySteamAppID(dto.id());
			for (Oferta o : ofertas) {
				bundle.addOferta(o);
			}

			return bundleRepository.save(bundle);
		} catch (DataIntegrityViolationException e) {
			return bundleRepository.findById(id).orElseThrow();
		}
	}
}
