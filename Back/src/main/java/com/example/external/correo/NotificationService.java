package com.example.external.correo;

import com.example.domain.repository.WishlistRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;


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
                    "¡INFORME DE CORTANA!",
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
                    "🗡�? ¡DESPIERTA, LINK!",
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

    @Scheduled(cron = "0 0 9 * * *")
    public void procesarYEnviarOferta() {
        List<Object[]> resultados = wishlistRepository.findEmailsAndOffersForNotification();
        Map<String, List<Object[]>> ofertasPorUsuario = resultados.stream()
                .collect(Collectors.groupingBy(fila -> (String) fila[0]));

        ofertasPorUsuario.forEach((email, ofertas) -> {
            enviarCorreo(email, ofertas);
        });


    }

    private void enviarCorreo(String emailDestino, List<Object[]> ofertas) {
        try {
            String asuntos;
            TemplateFriki friki = plantillas.get(random.nextInt(plantillas.size()));

            MimeMessage mensaje = mailSender.createMimeMessage();

            MimeMessageHelper complemento = new MimeMessageHelper(mensaje, true, "UTF-8");

            complemento.setFrom("QuestHub <onboarding@resend.dev>");
            complemento.setTo(emailDestino);


            if (ofertas.size() == 1) {
                String nombreJuego = (String) ofertas.get(0)[1];
                asuntos = friki.titulo() + " - " + nombreJuego;
            } else {
                asuntos = friki.titulo() + " - Multiples botines detectados !";
            }
            complemento.setSubject(asuntos);

            StringBuilder listaJuegosHtml = new StringBuilder();
            for (Object[] fila : ofertas) {
                String nombreJuego = String.valueOf(fila[1]);
                Double precio = Double.valueOf(fila[2].toString());
                String idJuego = String.valueOf(fila[3]);

                listaJuegosHtml.append(String.format("""
                            <div style="background-color: #333; padding: 15px; border-left: 5px solid %s; margin: 10px 0;">
                                <span style="font-size: 18px; color: #ffffff;">%s</span><br/>
                                <span style="font-size: 20px; color: #00ff00;"><strong>%.2f$</strong></span>
                                <a href="http://localhost:5173/juego/%s" style="color: %s; text-decoration: none; float: right;">Ver botín →</a>
                            </div>
                        """, friki.color(), nombreJuego, precio, idJuego, friki.color()));
            }


            String contenidoHtml = String.format("""
                            <div style="font-family: 'Segoe UI', sans-serif; background-color: #1a1a1a; color: #e0e0e0; padding: 20px; border-radius: 10px;">
                                <h1 style="color: %s; border-bottom: 2px solid %s;">%s</h1>
                                <p style="font-size: 18px;">%s</p>
                                %s 
                                <p>%s</p>
                                <footer style="margin-top: 20px; font-size: 12px; color: #777;">%s</footer>
                            </div>
                            """,
                    friki.color(), friki.color(), friki.titulo(),
                    friki.intro(),
                    listaJuegosHtml, // AQU�? VAN TODOS LOS JUEGOS
                    friki.cierre(),
                    friki.footer()
            );


            System.out.println("DEBUG: Se enviaría correo a: " + emailDestino);
            System.out.println("Asunto: " + complemento.getMimeMessage().getSubject());
            System.out.println("------------------------------------");
            complemento.setText(contenidoHtml, true);
            mailSender.send(mensaje);
        } catch (MessagingException e) {
            System.err.println("�?� Error al forjar el correo para " + emailDestino + ": " + e.getMessage());
        }
    }


}
