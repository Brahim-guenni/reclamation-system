package com.reclamation.controller;

import com.reclamation.entity.SuiviReclamation;
import com.reclamation.service.SuiviReclamationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suivis")
@Tag(name = "Suivi Réclamations")
@CrossOrigin(origins = "*")
public class SuiviReclamationController {

    private final SuiviReclamationService suiviService;

    public SuiviReclamationController(SuiviReclamationService suiviService) {
        this.suiviService = suiviService;
    }

    @GetMapping("/reclamation/{reclamationId}")
    public List<SuiviReclamation> findByReclamation(@PathVariable Long reclamationId) {
        return suiviService.findByReclamation(reclamationId);
    }

    @PostMapping
    public ResponseEntity<SuiviReclamation> create(@Valid @RequestBody SuiviReclamation suivi) {
        return ResponseEntity.ok(suiviService.save(suivi));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        suiviService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
