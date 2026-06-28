package com.ofos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Online Food Ordering System (OFOS)
 * 
 * Entry point for the Spring Boot application.
 * Demonstrates SOLID principles, layered architecture,
 * and design patterns (Strategy, State, Factory).
 */
@SpringBootApplication
@EnableAsync
public class OfosApplication {

    public static void main(String[] args) {
        SpringApplication.run(OfosApplication.class, args);
    }
}
