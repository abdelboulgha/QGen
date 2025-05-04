package com.example.backend.beans;

import com.example.backend.security.Role;
import jakarta.persistence.Entity;

@Entity
public class Admin extends Utilisateur {
    // Constructeur par défaut requis par JPA
    public Admin() {
        super();
        setRole(Role.ADMIN);
    }

    public Admin(String nom, String prenom, String email, String motDePasse) {
        super(nom, prenom, email, motDePasse);
        setRole(Role.ADMIN);
    }
}
