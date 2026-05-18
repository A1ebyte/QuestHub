package com.example.config;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

import com.example.exceptions.BadRequestException;


@RestControllerAdvice
public class ExceptionConfig {

    @ExceptionHandler(HttpClientErrorException.TooManyRequests.class)
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public Map<String, String>handleUUIDError(HttpClientErrorException.TooManyRequests e) {
    	e.printStackTrace();
	    String waitingTime = e.getResponseHeaders() != null
	            ? e.getResponseHeaders().getFirst("Retry-After")
	            : null;
	    return Map.of("message", "Problema de muchas peticiones "+ (waitingTime!=null?(",Bloqueado por: "+waitingTime):""));
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleBadRequest(BadRequestException ex) {
    	ex.printStackTrace();
        return Map.of("message", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleGeneralError(Exception ex) {
    	ex.printStackTrace();
        return Map.of("message", "Error interno del servidor "+ex.getMessage());
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleUUIDError(IllegalArgumentException ex) {
    	ex.printStackTrace();
        return Map.of("message", "Dato invalido "+ex.getMessage());
    }
    
    @ExceptionHandler(RestClientException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleUUIDError(RestClientException ex) {
    	ex.printStackTrace();
        return Map.of("message", "Problemas con algunos de los servicios "+ex.getMessage());
    }
}
