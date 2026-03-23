package com.example;

import java.util.List;
import org.springframework.core.ParameterizedTypeReference;
import com.example.model.OfertaDTO;
import com.example.model.TiendaDTO;

public class TypeRefs {
	public static final ParameterizedTypeReference<List<OfertaDTO>> 
		LIST_OF_OFERTAS = new ParameterizedTypeReference<>() {};

	public static final ParameterizedTypeReference<List<TiendaDTO>>
		LIST_OF_TIENDAS = new ParameterizedTypeReference<>() {};
}
