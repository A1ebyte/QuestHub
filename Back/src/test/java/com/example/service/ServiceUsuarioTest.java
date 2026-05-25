package com.example.service;

import com.example.domain.model.Usuario;
import com.example.domain.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceUsuarioTest {

    @Mock
    UsuarioRepository usuarioRepository;

    @InjectMocks
    ServiceUsuario serviceUsuario;

    @Test
    void actualizarNotificaciones_shouldUpdateAndReturnTrue() {

        UUID id = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setRecibirNotificaciones(false);

        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuario));

        boolean result = serviceUsuario.actualizarNotificaciones(id, true);

        assertTrue(result);
        assertTrue(usuario.isRecibirNotificaciones());

        verify(usuarioRepository).save(usuario);
    }

    @Test
    void actualizarNotificaciones_shouldReturnFalseWhenUserNotFound() {

        UUID id = UUID.randomUUID();

        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        boolean result = serviceUsuario.actualizarNotificaciones(id, true);

        assertFalse(result);

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void eliminarCuentaCompleta_shouldThrowExceptionBecauseHttpCallFails() {

        UUID id = UUID.randomUUID();

        ReflectionTestUtils.setField(serviceUsuario, "supabeUrl", "http://localhost");
        ReflectionTestUtils.setField(serviceUsuario, "serviceRoleKey", "test");

        assertThrows(Exception.class,
                () -> serviceUsuario.eliminarCuentaCompleta(id));
    }

    @Test
    void eliminarCuentaCompleta_shouldNotReachRepositoryBecauseHttpFailsFirst() {

        UUID id = UUID.randomUUID();

        ReflectionTestUtils.setField(serviceUsuario, "supabeUrl", "http://localhost");
        ReflectionTestUtils.setField(serviceUsuario, "serviceRoleKey", "test");

        lenient().when(usuarioRepository.existsById(id)).thenReturn(false);

        assertThrows(Exception.class,
                () -> serviceUsuario.eliminarCuentaCompleta(id));
    }

    @Test
    void extraerIdDelToken_shouldReturnUUID() {

        UUID expected = UUID.randomUUID();

        String payload = "{\"sub\":\"" + expected + "\"}";

        String token = "header." +
                java.util.Base64.getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(payload.getBytes()) +
                ".signature";

        UUID result = serviceUsuario.extraerIdDelToken(token);

        assertEquals(expected, result);
    }

    @Test
    void extraerIdDelToken_shouldThrowException() {

        String payload = "not-json";

        String token = "header." +
                java.util.Base64.getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(payload.getBytes()) +
                ".signature";

        assertThrows(RestClientException.class,
                () -> serviceUsuario.extraerIdDelToken(token));
    }
}