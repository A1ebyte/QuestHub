package com.example.service;

import com.example.domain.repository.UsuarioRepository;
import com.example.exceptions.BadRequestException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.util.Base64;
import java.util.UUID;

@Service
public class ServiceUsuario {
    private UsuarioRepository usuarioRepository;

    @Value("${supabase.url}")
    private String supabeUrl;

    @Value("${supabase.service_role_key}")
    private String serviceRoleKey;

    public ServiceUsuario(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public void eliminarCuentaCompleta(UUID userId) {
    	eliminarEnSupabaseAuth(userId);
        
        if(usuarioRepository.existsById(userId)) {
            usuarioRepository.deleteById(userId);
            return;
        }
        
        throw new BadRequestException("Usuario no encontrado en la base de datos");
    }

    private void eliminarEnSupabaseAuth(UUID userId) {
        RestTemplate restTemplate = new RestTemplate();

        String url = supabeUrl + "/auth/v1/admin/users/" + userId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey",serviceRoleKey);
        headers.set("Authorization","Bearer " + serviceRoleKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
    }

    public UUID extraerIdDelToken(String token) {
        String[] chunks = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String payload = new String(decoder.decode(chunks[1]));

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(payload);
            return UUID.fromString(node.get("sub").asText());
        } catch (Exception e) {
            throw new RestClientException("Token invalido");
        }
    }
}
