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

    @Scheduled(cron = "0 20 22 * * *")
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
                String nombreItem = String.valueOf(ofertas.get(0)[1]);
                asuntos = String.format("%s - ¡%s está en oferta!", friki.titulo(), nombreItem);
            } else {
                asuntos = String.format("%s - ¡%d botines legendarios detectados!", friki.titulo(), ofertas.size());
            }
            complemento.setSubject(asuntos);

            StringBuilder listaHtml = new StringBuilder();
            for (Object[] fila : ofertas) {
                String nombre = String.valueOf(fila[1]);
                Double precio = Double.valueOf(fila[2].toString());
                String idItem = String.valueOf(fila[3]);
                String tipo = String.valueOf(fila[4]);
                String rutaFront = tipo.equalsIgnoreCase("BUNDLE") ? "bundle" : "juego";
                String urlFinal = "http://localhost:5173/" + rutaFront + "/" + idItem;
                listaHtml.append(String.format("""
                        <div style="background-color: #2a2a2a; padding: 15px; border-left: 5px solid %s; margin: 10px 0; border-radius: 4px;">
                                            <div style="float: left; width: 70%%;">
                                                <span style="font-size: 18px; color: #ffffff; font-weight: bold;">%s</span><br/>
                                                <span style="font-size: 14px; color: #888;">Categoría: %s</span><br/>
                                                <span style="font-size: 22px; color: #00ff00; font-weight: bold;">%.2f€</span>
                                            </div>
                                            <div style="float: right; width: 25%%; text-align: right; padding-top: 10px;">
                                                <a href="%s" style="background-color: %s; color: white; text-decoration: none; padding: 8px 12px; border-radius: 5px; font-weight: bold; font-size: 12px;">VER BOTÍN</a>
                                            </div>
                                            <div style="clear: both;"></div>
                                        </div>
                        """, friki.color(), nombre, tipo, precio, urlFinal, friki.color()));
            }


            String contenidoHtml = String.format("""
                                            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #121212; color: #e0e0e0; padding: 30px; border-radius: 10px;">
                                <h1 style="color: %s; margin-top: 0;">%s</h1>
                                <p style="font-size: 18px; line-height: 1.5;">%s</p>
                                <div style="margin: 20px 0;">
                                    %s
                                </div>
                                <p style="font-style: italic; color: #bbb;">%s</p>
                                <footer style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #333; font-size: 12px; color: #666;">
                                    %s<br/>
                                    QuestHub - Notificaciones automáticas de la Ciudadela.
                                </footer>
                            </div>
                            """,
                    friki.color(), friki.titulo(),
                    friki.intro(),
                    listaHtml.toString(),
                    friki.cierre(),
                    friki.footer()
            );


            System.out.println(String.format("📧 Enviando notificación a [%s] con %d ofertas. Plantilla: %s",
                    emailDestino, ofertas.size(), friki.titulo()));
            complemento.setText(contenidoHtml, true);
            mailSender.send(mensaje);
        } catch (MessagingException e) {
            System.err.println("�?� Error al forjar el correo para " + emailDestino + ": " + e.getMessage());
        }
    }


}
