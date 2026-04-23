package com.reclamation.entity;

import com.reclamation.enums.StatutReclamation;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "reclamations")
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @NotBlank(message = "Le produit est obligatoire")
    private String produit;

    @Enumerated(EnumType.STRING)
    private StatutReclamation statut = StatutReclamation.EN_ATTENTE;

    @NotBlank(message = "La description est obligatoire")
    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate date = LocalDate.now();

    @Min(value = 1) @Max(value = 5)
    private Integer note;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private AgentSAV agentSAV;

    // user who submitted this reclamation
    @Column(name = "user_id")
    private Long userId;

    public Reclamation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public String getProduit() { return produit; }
    public void setProduit(String produit) { this.produit = produit; }
    public StatutReclamation getStatut() { return statut; }
    public void setStatut(StatutReclamation statut) { this.statut = statut; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Integer getNote() { return note; }
    public void setNote(Integer note) { this.note = note; }
    public AgentSAV getAgentSAV() { return agentSAV; }
    public void setAgentSAV(AgentSAV agentSAV) { this.agentSAV = agentSAV; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
