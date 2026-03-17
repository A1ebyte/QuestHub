package com.example.model.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

//Ejemplo Entitys
public class GenerosEntity {
	@Entity
	public class Genero {
	    @Id
	    private Long id;
	    private String nombre;
	}
	
}
