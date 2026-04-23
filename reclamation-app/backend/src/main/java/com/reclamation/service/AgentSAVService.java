package com.reclamation.service;

import com.reclamation.entity.AgentSAV;
import com.reclamation.repository.AgentSAVRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AgentSAVService {

    private final AgentSAVRepository agentSAVRepository;

    public AgentSAVService(AgentSAVRepository agentSAVRepository) {
        this.agentSAVRepository = agentSAVRepository;
    }

    public List<AgentSAV> findAll() { return agentSAVRepository.findAll(); }

    public AgentSAV findById(Long id) {
        return agentSAVRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent SAV non trouvé avec l'id: " + id));
    }

    public AgentSAV save(AgentSAV agent) { return agentSAVRepository.save(agent); }

    public AgentSAV update(Long id, AgentSAV agent) {
        AgentSAV existing = findById(id);
        existing.setNom(agent.getNom());
        existing.setCompetence(agent.getCompetence());
        return agentSAVRepository.save(existing);
    }

    public void delete(Long id) { agentSAVRepository.deleteById(id); }
}
