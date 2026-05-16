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
		executor.setCorePoolSize(3); // hilos m�nimos
		executor.setMaxPoolSize(4); // hilos m�ximos
		executor.setQueueCapacity(60); // tareas en cola
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
