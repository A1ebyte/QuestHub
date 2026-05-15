package com.example.api.controller.DTOs.Recibir;

import java.util.UUID;

public record UsuarioNotificaciones(
		UUID id,
		boolean preferencia) {}
