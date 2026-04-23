package com.reclamation.service;

import com.reclamation.entity.SuiviReclamation;
import com.reclamation.repository.SuiviReclamationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SuiviReclamationService {

    private final SuiviReclamationRepository suiviRepository;

    public SuiviReclamationService(SuiviReclamationRepository suiviRepository) {
        this.suiviRepository = suiviRepository;
    }

    public List<SuiviReclamation> findByReclamation(Long reclamationId) {
        return suiviRepository.findByReclamationIdOrderByDateDesc(reclamationId);
    }

    public SuiviReclamation save(SuiviReclamation suivi) { return suiviRepository.save(suivi); }

    public void delete(Long id) { suiviRepository.deleteById(id); }
}
