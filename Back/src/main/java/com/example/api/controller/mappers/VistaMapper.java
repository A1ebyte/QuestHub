package com.example.api.controller.mappers;

import org.springframework.data.domain.Page;
import com.example.api.controller.DTOs.ViewOfertaFront;
import com.example.domain.model.VistaOferta;

public class VistaMapper {

	private static ViewOfertaFront toDTO(VistaOferta vista) {
	    return new ViewOfertaFront(
	    		vista.getSteamAppId(),
	    		vista.getPrecioOferta(),
	            vista.getAhorro(),
	            vista.getOfertaRating(),
	            vista.getImagen(),
	            vista.getTitulo(),
	            vista.getRecent(),
	            vista.getReviews(),
	            vista.getTiendaIdsList()
	            );
	}

	public static Page<ViewOfertaFront> toDTOs(Page<VistaOferta> vistas) {
	    return vistas.map(VistaMapper::toDTO);
	}
}
