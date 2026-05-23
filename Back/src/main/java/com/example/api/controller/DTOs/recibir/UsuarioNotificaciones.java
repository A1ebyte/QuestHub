package com.example.api.controller.DTOs.recibir;

import java.util.UUID;

public record UsuarioNotificaciones(
		UUID id,
		boolean preferencia) {}
