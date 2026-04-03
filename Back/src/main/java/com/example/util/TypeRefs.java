package com.example.util;

import java.util.List;
import org.springframework.core.ParameterizedTypeReference;

import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;

public class TypeRefs {
	public static final ParameterizedTypeReference<List<OfertaDTO>> 
		LIST_OF_OFERTAS = new ParameterizedTypeReference<>() {};

	public static final ParameterizedTypeReference<List<TiendaDTO>>
		LIST_OF_TIENDAS = new ParameterizedTypeReference<>() {};
}
