package com.reclamation.service;

import com.reclamation.entity.AgentSAV;
import com.reclamation.entity.Reclamation;
import com.reclamation.enums.StatutReclamation;
import com.reclamation.repository.ReclamationRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final AgentSAVService agentSAVService;

    public ReclamationService(ReclamationRepository reclamationRepository, AgentSAVService agentSAVService) {
        this.reclamationRepository = reclamationRepository;
        this.agentSAVService = agentSAVService;
    }

    public List<Reclamation> findAll() { return reclamationRepository.findAll(); }

    public Reclamation findById(Long id) {
        return reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation non trouvée: " + id));
    }

    // réclamations du client connecté
    public List<Reclamation> findByUserId(Long userId) {
        return reclamationRepository.findByUserId(userId);
    }

    // réclamations assignées à un agent
    public List<Reclamation> findByAgent(Long agentId) {
        return reclamationRepository.findByAgentSAVId(agentId);
    }

    public List<Reclamation> findByStatut(StatutReclamation statut) {
        return reclamationRepository.findByStatut(statut);
    }

    public Reclamation save(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    public Reclamation update(Long id, Reclamation reclamation) {
        Reclamation existing = findById(id);
        existing.setProduit(reclamation.getProduit());
        existing.setDescription(reclamation.getDescription());
        existing.setStatut(reclamation.getStatut());
        existing.setNote(reclamation.getNote());
        return reclamationRepository.save(existing);
    }

    public Reclamation affecterAgent(Long reclamationId, Long agentId) {
        Reclamation reclamation = findById(reclamationId);
        AgentSAV agent = agentSAVService.findById(agentId);
        reclamation.setAgentSAV(agent);
        reclamation.setStatut(StatutReclamation.EN_COURS);
        return reclamationRepository.save(reclamation);
    }

    public void delete(Long id) { reclamationRepository.deleteById(id); }

    public Map<String, Object> getRapportSatisfaction() {
        Map<String, Object> rapport = new HashMap<>();
        rapport.put("noteMoyenne", reclamationRepository.findAverageNote());
        rapport.put("total", reclamationRepository.count());
        Map<String, Long> parStatut = new HashMap<>();
        reclamationRepository.countByStatut().forEach(row ->
                parStatut.put(row[0].toString(), (Long) row[1]));
        rapport.put("parStatut", parStatut);
        long resolues = parStatut.getOrDefault("RESOLUE", 0L);
        long total = reclamationRepository.count();
        rapport.put("tauxResolution", total > 0 ? (resolues * 100.0 / total) : 0);
        return rapport;
    }
}
