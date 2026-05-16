package com.example.service.bundle;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.api.controller.DTOs.BundleFront;
import com.example.api.controller.mappers.FrontMapper;
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

@Service
public class ServiceBundle {

	private final SteamClient steamClient;
	private final ServiceAsyncBundle serviceAsyncBundle;
	private final BundleRepository bundleRepository;
	private final OfertaRepository ofertaRepository;

	public ServiceBundle(BundleRepository bundleRepository, SteamClient steamClient, OfertaRepository ofertaRepository,
			ServiceAsyncBundle serviceAsyncBundle) {
		this.bundleRepository = bundleRepository;
		this.steamClient = steamClient;
		this.ofertaRepository = ofertaRepository;
		this.serviceAsyncBundle = serviceAsyncBundle;
	}

	public BundleFront buscarPorId(long id) {
		Bundle data = bundleRepository.findById(id).orElse(null);
		if (data != null) {
			return FrontMapper.toDTO(data);
		}

		BundleSteamDTO bundleDto = steamClient.getBundle(id);

		if (bundleDto == null) {
			return null;
		}

		serviceAsyncBundle.guardarBundleAsync(id);

		List<Oferta> ofertas = ofertaRepository.findBySteamAppID(id);
		Set<BundleProductos> prods = new HashSet<>();
		if (bundleDto.apps() != null) {
			for (BundleInfoDTO producto : bundleDto.apps()) {
				VideojuegoSteamDTO video = steamClient.getGame(producto.id());
				BundleProductos prod = SteamMapper.toEntity(producto);
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
				prods.add(prod);
			}
		}
		System.out.println("Guardado Async");
		return FrontMapper.toDTO(bundleDto, ofertas, prods);
	}

	public Bundle buscarEntidadPorId(long id) {
		return bundleRepository.findById(id).orElseGet(() -> serviceAsyncBundle.createBundle(id));
	}
}
