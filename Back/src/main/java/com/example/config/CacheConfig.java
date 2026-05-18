package com.example.config;

import com.github.benmanes.caffeine.cache.Caffeine;

import java.time.Duration;
import java.util.List;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

	@Bean
	public CacheManager cacheManager() {

		SimpleCacheManager manager = new SimpleCacheManager();

		List<CaffeineCache> caches = List.of(

				new CaffeineCache("wishlist",
						Caffeine.newBuilder().maximumSize(10_000).expireAfterWrite(Duration.ofMinutes(15)).build()),

				new CaffeineCache("tiendas",
						Caffeine.newBuilder().maximumSize(100).expireAfterWrite(Duration.ofDays(1)).build()),
				
				new CaffeineCache("max-precio",
						Caffeine.newBuilder().maximumSize(10).expireAfterWrite(Duration.ofHours(8)).build()),

				new CaffeineCache("videojuegos",
						Caffeine.newBuilder().maximumSize(8_000).expireAfterWrite(Duration.ofHours(8)).build()),

				new CaffeineCache("videojuego-entity",
						Caffeine.newBuilder().maximumSize(2_000).expireAfterWrite(Duration.ofHours(8)).build()),

				new CaffeineCache("bundles",
						Caffeine.newBuilder().maximumSize(5_000).expireAfterWrite(Duration.ofHours(8)).build()),
				
				new CaffeineCache("bundle-entity",
						Caffeine.newBuilder().maximumSize(1_000).expireAfterWrite(Duration.ofHours(8)).build()),
				
				new CaffeineCache("search-ofertas",
    					Caffeine.newBuilder().maximumSize(5_000).expireAfterWrite(Duration.ofHours(8)).build()));

		manager.setCaches(caches);

		return manager;
	}
}