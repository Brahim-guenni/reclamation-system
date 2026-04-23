package com.reclamation.repository;

import com.reclamation.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
    boolean existsByEmail(String email);
}
