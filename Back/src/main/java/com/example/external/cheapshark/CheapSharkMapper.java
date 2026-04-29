package com.example.external.cheapshark;

import java.net.HttpURLConnection;
import java.net.URI;

import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.util.DateConversion;

public class CheapSharkMapper {

	private static final String URL_INICIO_DEAL="https://www.cheapshark.com/redirect?dealID=";
    private static final String STEAMGAME_IMAGE_BASE = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/";
    private static final String STEAMSUBS_IMAGE_BASE = "https://shared.akamai.steamstatic.com/store_item_assets/steam/subs/";
	
	public static Oferta toEntity(OfertaDTO dto) {
		  Oferta oferta = new Oferta();
		  //para los deals poner primero https://www.cheapshark.com/redirect?dealID= y luego el deal number
		  String url = URL_INICIO_DEAL + dto.dealID();
		  oferta.setAhorro(dto.savings());
		  oferta.setOfertaRating(dto.dealRating());
		  oferta.setPrecioOferta(dto.salePrice());
		  oferta.setPrecioOriginal(dto.normalPrice());
		  oferta.setThumb(urlImagen(dto.steamAppID()).isBlank()?dto.thumb():urlImagen(dto.steamAppID()));
		  oferta.setCambiarImg(urlImagen(dto.steamAppID()).isBlank());
		  oferta.setUrlCompra(url);
		  oferta.setInicioOferta(DateConversion.fromCheapsharkUnix(dto.lastChange()));
		  oferta.setIdOferta(dto.dealID());
		  oferta.setSteamRating(dto.steamRatingPercent());
		  oferta.setTitulo(dto.title());
		  oferta.setSteamAppID(Long.valueOf(dto.steamAppID()));
		  return oferta;
	  }



	public static Tienda toEntity(TiendaDTO dto) {
		Tienda tienda = new Tienda();
		String base="https://www.cheapshark.com";
        String banner = dto.images() != null ? base + dto.images().get("banner") : null;
        String logo   = dto.images() != null ? base + dto.images().get("logo") : null;
        String icon   = dto.images() != null ? base + dto.images().get("icon") : null;
		tienda.setNombre(dto.storeName());
		tienda.setIdTienda(dto.storeID());
		tienda.setLogo(logo);
		tienda.setIcon(icon);
		tienda.setBanner(banner);

        return tienda;
	}
	
    private static boolean steamImageExists(String steamUrl) {
        try {
            URI uri = URI.create(steamUrl);
            HttpURLConnection connection = (HttpURLConnection) uri.toURL().openConnection();

            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(3000);
            connection.setReadTimeout(3000);

            int responseCode = connection.getResponseCode();
            return responseCode == 200;

        } catch (Exception e) {
            return false;
        }
    }
    
    private static String urlImagen(String id) {
    	if(steamImageExists(imageGAME(id)))
    		return imageGAME(id);
    	if(steamImageExists(imageSUBS(id)))
    		return imageSUBS(id);
    	return "";
    }

    private static String imageGAME(String id) {
    	return STEAMGAME_IMAGE_BASE + id + "/header.jpg";
    }
    
    private static String imageSUBS(String id) {
    	return STEAMSUBS_IMAGE_BASE + id + "/header_ratio.jpg";
    }
}
