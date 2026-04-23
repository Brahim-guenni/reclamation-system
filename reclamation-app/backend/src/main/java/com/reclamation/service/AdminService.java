package com.reclamation.service;

import com.reclamation.entity.User;
import com.reclamation.enums.Role;
import com.reclamation.repository.AgentSAVRepository;
import com.reclamation.repository.ClientRepository;
import com.reclamation.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final AgentSAVRepository agentSAVRepository;

    public AdminService(UserRepository userRepository, ClientRepository clientRepository,
                        AgentSAVRepository agentSAVRepository) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.agentSAVRepository = agentSAVRepository;
    }

    public List<User> getClients() {
        return userRepository.findByRole(Role.CLIENT);
    }

    public List<User> getAgents() {
        return userRepository.findByRole(Role.AGENT_SAV);
    }

    @Transactional
    public void deleteClient(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        // delete from clients table too
        if (user.getAgentSavId() != null) {
            clientRepository.deleteById(user.getAgentSavId());
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    public void deleteAgent(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        // delete from agents_sav table too
        if (user.getAgentSavId() != null) {
            agentSAVRepository.deleteById(user.getAgentSavId());
        }
        userRepository.deleteById(userId);
    }
}
