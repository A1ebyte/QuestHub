package com.example.util;
import org.apache.commons.text.StringEscapeUtils;

public class SteamDecoderDescription {

    public static String procesarDescripcion(String raw) {
        return StringEscapeUtils.unescapeJson(raw);
    }
}