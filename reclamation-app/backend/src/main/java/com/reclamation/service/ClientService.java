package com.reclamation.service;

import com.reclamation.entity.Client;
import com.reclamation.repository.ClientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> findAll() { return clientRepository.findAll(); }

    public Client findById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id: " + id));
    }

    public Client save(Client client) { return clientRepository.save(client); }

    public Client update(Long id, Client client) {
        Client existing = findById(id);
        existing.setNom(client.getNom());
        existing.setEmail(client.getEmail());
        existing.setTelephone(client.getTelephone());
        return clientRepository.save(existing);
    }

    public void delete(Long id) { clientRepository.deleteById(id); }
}
