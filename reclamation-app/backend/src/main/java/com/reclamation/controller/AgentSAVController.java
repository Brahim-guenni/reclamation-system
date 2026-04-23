package com.reclamation.controller;

import com.reclamation.entity.AgentSAV;
import com.reclamation.service.AgentSAVService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/agents")
@Tag(name = "Agents SAV")
@CrossOrigin(origins = "*")
public class AgentSAVController {

    private final AgentSAVService agentSAVService;

    public AgentSAVController(AgentSAVService agentSAVService) {
        this.agentSAVService = agentSAVService;
    }

    @GetMapping
    public List<AgentSAV> findAll() { return agentSAVService.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<AgentSAV> findById(@PathVariable Long id) {
        return ResponseEntity.ok(agentSAVService.findById(id));
    }

    @PostMapping
    public ResponseEntity<AgentSAV> create(@Valid @RequestBody AgentSAV agent) {
        return ResponseEntity.ok(agentSAVService.save(agent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgentSAV> update(@PathVariable Long id, @Valid @RequestBody AgentSAV agent) {
        return ResponseEntity.ok(agentSAVService.update(id, agent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        agentSAVService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
