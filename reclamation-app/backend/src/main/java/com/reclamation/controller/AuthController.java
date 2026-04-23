package com.reclamation.controller;

import com.reclamation.dto.*;
import com.reclamation.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentification")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Public: client self-registration
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // Public: login for all roles
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // Admin only: create an agent SAV account
    @PostMapping("/create-agent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthResponse> createAgent(@Valid @RequestBody CreateAgentRequest request) {
        return ResponseEntity.ok(authService.createAgentAccount(request));
    }
}
