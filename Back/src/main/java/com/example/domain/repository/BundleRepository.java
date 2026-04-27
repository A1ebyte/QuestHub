package com.example.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.domain.model.Bundle;

@Repository
public interface BundleRepository extends JpaRepository<Bundle, Long> {
}
