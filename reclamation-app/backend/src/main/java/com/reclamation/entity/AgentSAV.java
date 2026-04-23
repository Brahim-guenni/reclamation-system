package com.reclamation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "agents_sav")
public class AgentSAV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "La compétence est obligatoire")
    private String competence;

    public AgentSAV() {}
    public AgentSAV(Long id, String nom, String competence) {
        this.id = id; this.nom = nom; this.competence = competence;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getCompetence() { return competence; }
    public void setCompetence(String competence) { this.competence = competence; }
}
