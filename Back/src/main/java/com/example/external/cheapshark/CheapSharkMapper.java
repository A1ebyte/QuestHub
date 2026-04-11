package com.example.external.cheapshark;

import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.util.DateConversion;

public class CheapSharkMapper {


	public static Oferta toEntity(OfertaDTO dto) {
		  Oferta oferta = new Oferta();
			String url = "https://www.cheapshark.com/redirect?dealID=" + dto.dealID();
		  oferta.setAhorro(dto.savings());
		  oferta.setOfertaRating(dto.dealRating());
		  oferta.setPrecioOferta(dto.salePrice());
		  oferta.setPrecioOriginal(dto.normalPrice());
		  oferta.setUrlImagen(dto.thumb());
		  oferta.setUrlCompra(url);
		  oferta.setInicioOferta(DateConversion.fromCheapsharkUnix(dto.lastChange()));
		  oferta.setIdOferta(dto.dealID());
		  oferta.setSteamRating(dto.steamRatingPercent());
		  oferta.setTitulo(dto.title());
		  oferta.setSteamAppID(Long.valueOf(dto.steamAppID()));
		  return oferta;
	  //para los deals poner primero https://www.cheapshark.com/redirect?dealID= y luego el deal number
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
}
