package com.reclamation.repository;

import com.reclamation.entity.Reclamation;
import com.reclamation.enums.StatutReclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByUserId(Long userId);
    List<Reclamation> findByClientId(Long clientId);
    List<Reclamation> findByStatut(StatutReclamation statut);
    List<Reclamation> findByAgentSAVId(Long agentId);

    @Query("SELECT AVG(r.note) FROM Reclamation r WHERE r.note IS NOT NULL")
    Double findAverageNote();

    @Query("SELECT r.statut, COUNT(r) FROM Reclamation r GROUP BY r.statut")
    List<Object[]> countByStatut();
}
