package com.example.api.controller.DTOs.recibir;

import java.util.UUID;

public record UsuarioSync(
		UUID id,
		String email) {}
