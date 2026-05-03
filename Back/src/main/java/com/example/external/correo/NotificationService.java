package com.example.external.correo;

import com.example.domain.repository.WishlistRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
                    "🔥 [SANTUARIO ACTIVO] Tu objeto ha regresado",
                    "Las campanas han doblado una vez más en el Enlace de Fuego.",
                    "El objeto <strong style='color:#ff8c00;'>%s</strong> ha reaparecido con un precio reducido.",
                    "No permitas que otro No-Muerto lo reclame antes que tú.",
                    "⚔️ Reclámalo ahora antes de que desaparezca.",
                    "#ff4500"
            ),
            new TemplateFriki(
                    "🟦 [UNSC PRIORITY] Oferta detectada",
                    "Cortana ha interceptado una señal en el sistema.",
                    "El recurso <strong style='color:#00bfff;'>%s</strong> está disponible a precio reducido.",
                    "Jefe Maestro, esta oportunidad no permanecerá abierta mucho tiempo.",
                    "🎯 Asegura el suministro ahora.",
                    "#00bfff"
            ),
            new TemplateFriki(
                    "🚀 [NORMANDY ALERT] Señal prioritaria",
                    "Comandante, hemos detectado una anomalía en el mercado.",
                    "El artefacto <strong style='color:#ff0000;'>%s</strong> ha reducido su precio.",
                    "Los Segadores no esperan. Esta oferta tampoco.",
                    "🛰️ Accede ahora antes de que desaparezca.",
                    "#ff0000"
            ),
            new TemplateFriki(
                    "🗡️ [HYRULE ALERT] Nuevo tesoro detectado",
                    "Un viajero ha traído noticias desde Hyrule.",
                    "El tesoro <strong style='color:#32cd32;'>%s</strong> ha bajado de precio.",
                    "No dejes que otro héroe lo encuentre antes que tú.",
                    "🛡️ Consíguelo ahora y sigue tu aventura.",
                    "#32cd32"
            )


    );

    public NotificationService(WishlistRepository wishlistRepository, JavaMailSender mailSender) {
        this.wishlistRepository = wishlistRepository;
        this.mailSender = mailSender;
    }

    @Scheduled(cron = "0 0 19 * * *")
    public void procesarYEnviarOferta() {

        LocalDateTime fechaReferencia = LocalDateTime.now()
                .minusDays(1)
                .withHour(8)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
        List<Object[]> resultados = wishlistRepository.findEmailsAndOffersForNotification(fechaReferencia);

        if (resultados.isEmpty()) {
            System.out.println("ℹ️ No se han encontrado ofertas nuevas desde las 08:00 del día anterior.");
            return;
        }

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
                            <div style="background: linear-gradient(145deg, #1e1e1e, #252525); 
                                        padding: 20px; 
                                        margin: 15px 0; 
                                        border-radius: 10px; 
                                        border: 1px solid #333;
                                        box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                        
                                <table width="100%%" style="border-collapse: collapse;">
                                    <tr>
                                        <td style="vertical-align: top; padding-right: 10px;">
                                            <div style="font-size: 18px; font-weight: bold; color: #ffffff;">
                                                %s
                                            </div>
                                            <div style="font-size: 13px; color: #888; margin-top: 5px;">
                                                %s
                                            </div>
                                            <div style="font-size: 24px; font-weight: bold; color: %s; margin-top: 10px;">
                                                %.2f€
                                            </div>
                                        </td>
                        
                                        <td style="vertical-align: middle; text-align: right;">
                                            <a href="%s" 
                                               style="display: inline-block;
                                                      background: %s;
                                                      color: #ffffff;
                                                      text-decoration: none;
                                                      padding: 12px 16px;
                                                      border-radius: 6px;
                                                      font-size: 13px;
                                                      font-weight: bold;
                                                      box-shadow: 0 0 10px %s;">
                                                ⚡ VER BOTÍN
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        """, nombre, tipo, friki.color(), precio, urlFinal, friki.color(), friki.color()));
            }


            String contenidoHtml = String.format("""
                            <div style="font-family: 'Segoe UI', Arial, sans-serif; 
                                        background: #0f0f0f; 
                                        color: #e0e0e0; 
                                        padding: 30px;">
                            
                                <div style="max-width: 600px; margin: auto; 
                                            background: #1a1a1a; 
                                            border-radius: 12px; 
                                            padding: 25px; 
                                            border: 1px solid #2a2a2a;
                                            box-shadow: 0 0 20px rgba(0,0,0,0.6);">
                            
                                    <h1 style="color: %s; margin-top: 0; font-size: 24px;">
                                        %s
                                    </h1>
                            
                                    <p style="font-size: 16px; line-height: 1.6; color: #ccc;">
                                        %s
                                    </p>
                            
                                    %s
                            
                                    <p style="margin-top: 25px; color: #aaa;">
                                        %s
                                    </p>
                            
                                    <div style="margin-top: 30px; padding-top: 15px; 
                                                border-top: 1px solid #333; 
                                                font-size: 12px; 
                                                color: #666;">
                                        %s<br/>
                                        <span style="color:#444;">QuestHub // Sistema de notificaciones</span>
                                    </div>
                                </div>
                            </div>
                            """,
                    friki.color(),
                    friki.titulo(),
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
