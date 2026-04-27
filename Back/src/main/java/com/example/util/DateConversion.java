package com.example.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Locale;


public class DateConversion {
	
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

	    try {
	        DateTimeFormatter english = new DateTimeFormatterBuilder()
	                .parseCaseInsensitive()
	                .appendPattern("d MMM yyyy")
	                .toFormatter(Locale.ENGLISH);
	        return LocalDate.parse(date, english);
	    } catch (Exception ignored) {}

	    try {
	        DateTimeFormatter spanish = new DateTimeFormatterBuilder()
	                .parseCaseInsensitive()
	                .appendPattern("d MMM yyyy")
	                .toFormatter(Locale.forLanguageTag("es-ES"));
	        return LocalDate.parse(date, spanish);
	    } catch (Exception ignored) {}

	    System.out.println("No se pudo parsear la fecha Steam: " + date);
	    return null;
	}

}
