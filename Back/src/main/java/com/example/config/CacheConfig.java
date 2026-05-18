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
						Caffeine.newBuilder().maximumSize(10_000).expireAfterWrite(Duration.ofMinutes(10)).build()),

				new CaffeineCache("preferencias-usuario",
						Caffeine.newBuilder().maximumSize(5_000).expireAfterWrite(Duration.ofMinutes(45)).build()),

				new CaffeineCache("videojuegos",
						Caffeine.newBuilder().maximumSize(20_000).expireAfterWrite(Duration.ofHours(8)).build()),

				new CaffeineCache("jwt-user-id",
						Caffeine.newBuilder().maximumSize(10_000).expireAfterWrite(Duration.ofMinutes(10)).build()),

				new CaffeineCache("tiendas",
						Caffeine.newBuilder().maximumSize(1_000).expireAfterWrite(Duration.ofDays(1)).build()),

				new CaffeineCache("oferta",
						Caffeine.newBuilder().maximumSize(100_000).expireAfterWrite(Duration.ofHours(8)).build()),

				new CaffeineCache("min-oferta",
						Caffeine.newBuilder().maximumSize(10_000).expireAfterWrite(Duration.ofHours(8)).build()),

				new CaffeineCache("videojuego-front",
						Caffeine.newBuilder().maximumSize(50_000).expireAfterWrite(Duration.ofHours(8)).build()),

				new CaffeineCache("videojuego-entity",
						Caffeine.newBuilder().maximumSize(50_000).expireAfterWrite(Duration.ofHours(8)).build()),

				new CaffeineCache("bundle-front",
						Caffeine.newBuilder().maximumSize(20_000).expireAfterWrite(Duration.ofHours(8)).build()),
				
				new CaffeineCache("bundle-entity",
						Caffeine.newBuilder().maximumSize(20_000).expireAfterWrite(Duration.ofHours(8)).build()));

		manager.setCaches(caches);

		return manager;
	}
}