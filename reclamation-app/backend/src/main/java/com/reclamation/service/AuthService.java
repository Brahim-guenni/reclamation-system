package com.reclamation.service;

import com.reclamation.dto.*;
import com.reclamation.entity.AgentSAV;
import com.reclamation.entity.Client;
import com.reclamation.entity.User;
import com.reclamation.enums.Role;
import com.reclamation.repository.AgentSAVRepository;
import com.reclamation.repository.ClientRepository;
import com.reclamation.repository.UserRepository;
import com.reclamation.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final AgentSAVRepository agentSAVRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, ClientRepository clientRepository,
                       AgentSAVRepository agentSAVRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.agentSAVRepository = agentSAVRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // Client self-registration: creates User + Client entry
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        // Create Client entity so admin can see them
        Client client = new Client();
        client.setNom(request.getNom());
        client.setEmail(request.getEmail());
        client.setTelephone(request.getTelephone() != null ? request.getTelephone() : "");
        Client savedClient = clientRepository.save(client);

        // Create User account linked to client
        User user = User.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CLIENT)
                .agentSavId(savedClient.getId()) // reuse field to store clientId
                .build();
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getNom(), user.getRole().name());
    }

    // Admin creates an agent SAV account
    public AuthResponse createAgentAccount(CreateAgentRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }
        // Check if AgentSAV with same name already exists, reuse it
        AgentSAV agent = agentSAVRepository.findByNom(request.getNom())
                .orElseGet(() -> {
                    AgentSAV newAgent = new AgentSAV();
                    newAgent.setNom(request.getNom());
                    newAgent.setCompetence(request.getCompetence());
                    return agentSAVRepository.save(newAgent);
                });

        // Update competence if provided
        if (request.getCompetence() != null && !request.getCompetence().isEmpty()) {
            agent.setCompetence(request.getCompetence());
            agentSAVRepository.save(agent);
        }

        User user = User.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.AGENT_SAV)
                .agentSavId(agent.getId())
                .build();
        userRepository.save(user);
        return new AuthResponse(null, user.getEmail(), user.getNom(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getNom(), user.getRole().name());
    }
}
