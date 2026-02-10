package com.bank.banking_system.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    // Redirect root (/) to Swagger UI
    @GetMapping("/")
    public ResponseEntity<Void> rootRedirect() {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("/swagger-ui/index.html"));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    // Keep a simple health endpoint for App Service
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return response;
    }
}
