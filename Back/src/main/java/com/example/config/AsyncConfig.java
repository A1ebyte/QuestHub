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
	
	@Bean(name = "viewExecutor")
	Executor viewExecutor() {
	    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
	    executor.setCorePoolSize(1);
	    executor.setMaxPoolSize(1);
	    executor.setQueueCapacity(1);
	    executor.setThreadNamePrefix("view-refresh-");
	    executor.initialize();
	    return executor;
	}

}
