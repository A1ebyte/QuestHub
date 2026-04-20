package com.example.api.controller;

import com.example.service.NotificationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class TestMailRunner implements CommandLineRunner {
    private final NotificationService notificationService;

    public TestMailRunner(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("Enviando correo de prueba a Mailtrap...");
        notificationService.procesarYEnviarOferta();
    }
}