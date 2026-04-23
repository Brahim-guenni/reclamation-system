package com.reclamation.controller;

import com.reclamation.entity.User;
import com.reclamation.service.AdminService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administration")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/clients")
    public List<User> getClients() {
        return adminService.getClients();
    }

    @GetMapping("/agents")
    public List<User> getAgents() {
        return adminService.getAgents();
    }

    @DeleteMapping("/clients/{userId}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long userId) {
        adminService.deleteClient(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/agents/{userId}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long userId) {
        adminService.deleteAgent(userId);
        return ResponseEntity.noContent().build();
    }
}
