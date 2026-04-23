package com.reclamation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suivis_reclamation")
public class SuiviReclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le message est obligatoire")
    @Column(columnDefinition = "TEXT")
    private String message;

    @ManyToOne
    @JoinColumn(name = "reclamation_id")
    @NotNull(message = "La réclamation est obligatoire")
    private Reclamation reclamation;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private AgentSAV agent;

    @NotBlank(message = "L'action est obligatoire")
    private String action;

    private LocalDateTime date = LocalDateTime.now();

    public SuiviReclamation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Reclamation getReclamation() { return reclamation; }
    public void setReclamation(Reclamation reclamation) { this.reclamation = reclamation; }
    public AgentSAV getAgent() { return agent; }
    public void setAgent(AgentSAV agent) { this.agent = agent; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}
