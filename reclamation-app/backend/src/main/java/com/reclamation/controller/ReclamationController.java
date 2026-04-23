package com.reclamation.controller;

import com.reclamation.entity.Reclamation;
import com.reclamation.entity.User;
import com.reclamation.enums.StatutReclamation;
import com.reclamation.service.ReclamationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reclamations")
@Tag(name = "Réclamations")
@CrossOrigin(origins = "*")
public class ReclamationController {

    private final ReclamationService reclamationService;

    public ReclamationController(ReclamationService reclamationService) {
        this.reclamationService = reclamationService;
    }

    // ADMIN: all reclamations
    @GetMapping
    public List<Reclamation> findAll() {
        return reclamationService.findAll();
    }

    // CLIENT: only their own reclamations
    @GetMapping("/mes")
    public List<Reclamation> findMine(@AuthenticationPrincipal User user) {
        return reclamationService.findByUserId(user.getId());
    }

    // AGENT_SAV: reclamations assigned to them
    @GetMapping("/assignees")
    public List<Reclamation> findAssignees(@AuthenticationPrincipal User user) {
        return reclamationService.findByAgent(user.getAgentSavId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reclamationService.findById(id));
    }

    @GetMapping("/statut/{statut}")
    public List<Reclamation> findByStatut(@PathVariable StatutReclamation statut) {
        return reclamationService.findByStatut(statut);
    }

    // CLIENT: submit a reclamation
    @PostMapping
    public ResponseEntity<Reclamation> create(@Valid @RequestBody Reclamation reclamation,
                                               @AuthenticationPrincipal User user) {
        reclamation.setUserId(user.getId());
        // attach the Client entity using the clientId stored in agentSavId for CLIENT role
        if (user.getAgentSavId() != null) {
            com.reclamation.entity.Client client = new com.reclamation.entity.Client();
            client.setId(user.getAgentSavId());
            reclamation.setClient(client);
        }
        return ResponseEntity.ok(reclamationService.save(reclamation));
    }

    // ADMIN: update reclamation
    @PutMapping("/{id}")
    public ResponseEntity<Reclamation> update(@PathVariable Long id,
                                               @RequestBody Reclamation reclamation) {
        return ResponseEntity.ok(reclamationService.update(id, reclamation));
    }

    // ADMIN: assign agent to reclamation
    @PutMapping("/{id}/affecter/{agentId}")
    public ResponseEntity<Reclamation> affecterAgent(@PathVariable Long id,
                                                      @PathVariable Long agentId) {
        return ResponseEntity.ok(reclamationService.affecterAgent(id, agentId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal User user) {
        Reclamation rec = reclamationService.findById(id);
        // only the client who created it can delete
        if (!rec.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        reclamationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rapport")
    public ResponseEntity<Map<String, Object>> getRapport() {
        return ResponseEntity.ok(reclamationService.getRapportSatisfaction());
    }
}
