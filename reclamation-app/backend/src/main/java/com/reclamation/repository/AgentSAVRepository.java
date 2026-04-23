package com.reclamation.repository;

import com.reclamation.entity.AgentSAV;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AgentSAVRepository extends JpaRepository<AgentSAV, Long> {
    List<AgentSAV> findByCompetenceContainingIgnoreCase(String competence);
    Optional<AgentSAV> findByNom(String nom);
}
