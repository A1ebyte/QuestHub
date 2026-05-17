package com.example.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class AsyncConfig {

	@Bean (name = "cheapSharkExecutor")
	Executor cheapSharkExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(2); // hilos minimos
		executor.setMaxPoolSize(3); // hilos maximos
		executor.setQueueCapacity(10); // tareas en cola
		executor.setThreadNamePrefix("CheapShark-");
		executor.initialize();
		return executor;
	}
	
    @Bean(name = "gameExecutor")
    public Executor gameExecutor() {

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(500);
		executor.setThreadNamePrefix("GameCreator-");
        executor.initialize();
        return executor;
    }
}
