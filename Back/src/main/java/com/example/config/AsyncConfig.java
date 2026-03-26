package com.example.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class AsyncConfig {

	@Bean
	public Executor cheapSharkExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(3); // hilos mínimos
		executor.setMaxPoolSize(4); // hilos máximos
		executor.setQueueCapacity(60); // tareas en cola
		executor.setThreadNamePrefix("CheapShark-");
		executor.initialize();
		return executor;
	}

}
