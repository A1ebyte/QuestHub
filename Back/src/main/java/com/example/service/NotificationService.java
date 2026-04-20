package com.example.service;

import com.example.domain.repository.WishlistRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final WishlistRepository wishlistRepository;
    private final JavaMailSender mailSender;

    public NotificationService(WishlistRepository wishlistRepository, JavaMailSender mailSender) {
        this.wishlistRepository = wishlistRepository;
        this.mailSender = mailSender;
    }

    @Scheduled(cron = "0 0 10 * * *")
    public void procesarYEnviarOferta() {
        List<Object[]> resultados = wishlistRepository.findEmailsAndOffersForNotification();
        for (Object[] fila : resultados) {
            String emailDestino = (String) fila[0];
            String nombreJuego = (String) fila[1];
            Double precio = (Double) fila[2];

            enviarCorreo(emailDestino, nombreJuego, precio);
        }


    }

    private void enviarCorreo(String emailDestino, String nombreJuego, Double precio) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(emailDestino);
        mensaje.setSubject("❤️‍🔥 SER DE CENIZA, TENEMOS UNA GRAN BAJA DE PRECIO " + nombreJuego);
        mensaje.setText("\"¡Hola!\n Buenas noticias:'" + nombreJuego + "' vuevle al enlace de fuego, esta ahora a solo " + precio + "€.\n" +
                "No piedas esta oportunidad");
        mailSender.send(mensaje);
    }

}
