package com.example.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Locale;


public class DateConversion {

    private static final DateTimeFormatter STEAM_DATE = new DateTimeFormatterBuilder()
            .parseCaseInsensitive()
            .appendPattern("d MMM yyyy")
            .toFormatter(Locale.forLanguageTag("es-ES"));
	
	public static LocalDateTime fromCheapsharkUnix(long unix) {
	    return Instant.ofEpochSecond(unix)
	            .atZone(ZoneId.systemDefault())
	            .toLocalDateTime();
	}
	
    public static LocalDate fromSteamDate(String date) {

        if (date == null || date.isBlank())
            return null;

        if (date.equalsIgnoreCase("Coming Soon") ||
            date.equalsIgnoreCase("Próximamente"))
            return null;

        return LocalDate.parse(date, STEAM_DATE);
    }
}
