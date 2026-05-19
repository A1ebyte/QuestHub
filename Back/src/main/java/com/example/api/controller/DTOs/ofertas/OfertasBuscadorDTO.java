package com.example.api.controller.DTOs.ofertas;

import java.util.Objects;

public record OfertasBuscadorDTO(
		long id, 
		String titulo, 
		String imagen) {
	
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OfertasBuscadorDTO other)) return false;
        return id == other.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
