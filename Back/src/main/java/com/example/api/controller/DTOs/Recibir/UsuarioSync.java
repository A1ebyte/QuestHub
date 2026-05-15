package com.example.api.controller.DTOs.Recibir;

import java.util.UUID;

public record UsuarioSync(
		UUID id,
		String email) {}
