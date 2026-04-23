package com.reclamation.dto;

import jakarta.validation.constraints.*;

public class CreateAgentRequest {

    @NotBlank
    private String nom;

    @Email @NotBlank
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    @NotBlank
    private String competence;

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getCompetence() { return competence; }
    public void setCompetence(String competence) { this.competence = competence; }
}
