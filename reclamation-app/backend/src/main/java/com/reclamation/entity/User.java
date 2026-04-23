package com.reclamation.entity;

import com.reclamation.enums.Role;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role;

    @Column(name = "agent_sav_id")
    private Long agentSavId;

    public User() {}

    public User(Long id, String email, String password, String nom, Role role, Long agentSavId) {
        this.id = id; this.email = email; this.password = password;
        this.nom = nom; this.role = role; this.agentSavId = agentSavId;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String email;
        private String password;
        private String nom;
        private Role role;
        private Long agentSavId;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder nom(String nom) { this.nom = nom; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder agentSavId(Long agentSavId) { this.agentSavId = agentSavId; return this; }
        public User build() { return new User(id, email, password, nom, role, agentSavId); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Long getAgentSavId() { return agentSavId; }
    public void setAgentSavId(Long agentSavId) { this.agentSavId = agentSavId; }
    public void setPassword(String password) { this.password = password; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
