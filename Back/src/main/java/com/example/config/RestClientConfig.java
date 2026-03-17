package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    RestClient restClientCheapShark(RestClient.Builder builder) {
        return builder
        		.baseUrl("https://www.cheapshark.com/api/1.0/")
        		.build();
    }
    
    @Bean
    RestClient restClientRawg(RestClient.Builder builder) {
        return builder
        		.baseUrl("https://api.rawg.io/api/")
        		.build();
    }
}
