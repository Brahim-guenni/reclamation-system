package com.reclamation.repository;

import com.reclamation.entity.SuiviReclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SuiviReclamationRepository extends JpaRepository<SuiviReclamation, Long> {
    List<SuiviReclamation> findByReclamationIdOrderByDateDesc(Long reclamationId);
}
