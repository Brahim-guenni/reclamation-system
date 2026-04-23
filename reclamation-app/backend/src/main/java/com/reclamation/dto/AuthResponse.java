package com.reclamation.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String nom;
    private String role;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String nom, String role) {
        this.token = token;
        this.email = email;
        this.nom = nom;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getNom() { return nom; }
    public String getRole() { return role; }
}
