package com.example.service;

import com.example.domain.repository.WishlistRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;


@Service
public class NotificationService {

    private final WishlistRepository wishlistRepository;
    private final JavaMailSender mailSender;
    private final Random random = new Random();


    private final List<TemplateFriki> plantillas = List.of(
            new TemplateFriki(
                    "🔥 ¡ATENCIÓN, SER DE CENIZA!",
                    "Las campanas han doblado y traen noticias del Santuario:",
                    "El objeto de tu deseo, <span style='color: #ff8c00;'>%s</span>, vuelve al Enlace de Fuego.",
                    "No permitas que tu llama se apague. El momento de actuar es ahora.",
                    "Has recibido esto porque 'tu llama sigue encendida' en nuestra lista de deseos.",
                    "#ff4500"
            ),
            new TemplateFriki(
                    "🛡️ ¡INFORME DE CORTANA!",
                    "Jefe Maestro, se ha detectado una anomalía de precio en el sector:",
                    "El suministro de <span style='color: #00bfff;'>%s</span> está disponible para su despliegue.",
                    "Necesitamos una resolución, Jefe. Termine la lucha antes de que el Covenant se lo lleve.",
                    "Transmitiendo por canales seguros de la UNSC.",
                    "#00bfff"
            ),
            new TemplateFriki(
                    "🚀 ¡SALUDOS DESDE LA NORMANDY!",
                    "Comandante Shepard, los escáneres de la Alianza han localizado una oferta:",
                    "El artefacto <span style='color: #ff0000;'>%s</span> ha bajado sus defensas de precio.",
                    "Es hora de reunir al equipo. No deje que los Segadores lleguen antes que usted.",
                    "Mensaje encriptado por la red de enlace de la Ciudadela.",
                    "#ff0000"
            ),
            new TemplateFriki(
                    "🗡️ ¡DESPIERTA, LINK!",
                    "Es peligroso ir solo, mira esta oferta que ha aparecido en Hyrule:",
                    "El tesoro <span style='color: #32cd32;'>%s</span> brilla con un nuevo precio.",
                    "Que la Trifuerza del ahorro te acompañe. El destino de tu cartera está en tus manos.",
                    "Enviado por un kolog que pasaba por aquí (¡Yahaha!).",
                    "#32cd32"
            )


    );

    public NotificationService(WishlistRepository wishlistRepository, JavaMailSender mailSender) {
        this.wishlistRepository = wishlistRepository;
        this.mailSender = mailSender;
    }

    @Scheduled(cron = "0 0 12 * * *")
    public void procesarYEnviarOferta() {
        List<Object[]> resultados = wishlistRepository.findEmailsAndOffersForNotification();
        for (Object[] fila : resultados) {
            String emailDestino = (String) fila[0];
            String nombreJuego = (String) fila[1];
            Double precio = (Double) fila[2];
            String idJuego = String.valueOf(fila[3]);

            enviarCorreo(emailDestino, nombreJuego, precio,idJuego);
        }


    }

    private void enviarCorreo(String emailDestino, String nombreJuego, Double precio,String idJuego) {
        try {
            TemplateFriki friki = plantillas.get(random.nextInt(plantillas.size()));

            MimeMessage mensaje = mailSender.createMimeMessage();

            MimeMessageHelper complemento = new MimeMessageHelper(mensaje, true, "UTF-8");

            complemento.setFrom("QuestHub <onboarding@resend.dev>");
            complemento.setTo(emailDestino);
            complemento.setSubject(friki.titulo() + " - " + nombreJuego);


            String contenidoHtml = String.format("""
                            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a; color: #e0e0e0; padding: 20px; border-radius: 10px; border: 1px solid %s;">
                                <div style="text-align: center; border-bottom: 2px solid %s; padding-bottom: 10px;">
                                    <h1 style="color: %s; margin: 0;">%s</h1>
                                </div>
                                <div style="padding: 20px; line-height: 1.6;">
                                    <p style="font-size: 18px;">%s</p>
                                    <p style="font-size: 20px; font-weight: bold; color: #ffffff;">
                                        %s
                                    </p>
                                    <div style="background-color: #333; padding: 15px; border-left: 5px solid %s; margin: 20px 0;">
                                        <span style="font-size: 24px;">Precio actual: <strong style="color: #00ff00;">%.2f$</strong></span>
                                    </div>
                                    <p>%s</p>
                                </div>
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="http://localhost:5173/juego/%s" style="background-color: %s; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                                        RECLAMAR MI OFERTA
                                    </a>
                                </div>
                                <footer style="margin-top: 40px; font-size: 12px; text-align: center; color: #777;">
                                    %s
                                </footer>
                            </div>
                            """,
                    friki.color(), friki.color(), friki.color(), friki.titulo(),
                    friki.intro(),
                    String.format(friki.cuerpo(), nombreJuego), // Insertamos el nombre del juego en la frase temática
                    friki.color(), precio,
                    friki.cierre(),
                    idJuego,
                    friki.color(), friki.footer());


            System.out.println("DEBUG: Se enviaría correo a: " + emailDestino);
            System.out.println("Asunto: " + complemento.getMimeMessage().getSubject());
            System.out.println("------------------------------------");
            complemento.setText(contenidoHtml, true);
            mailSender.send(mensaje);
        } catch (MessagingException e) {
            System.err.println("❌ Error al forjar el correo para " + emailDestino + ": " + e.getMessage());
        }
    }

}
