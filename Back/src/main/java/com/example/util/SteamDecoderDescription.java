package com.example.util;
import tools.jackson.databind.ObjectMapper;

public class SteamDecoderDescription {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String procesarDescripcion(String raw) {
        try { return objectMapper.readValue("\"" + raw + "\"", String.class); } 
        catch (Exception e) {
        	System.out.println("RAW");
            return raw;
        }
    }
}