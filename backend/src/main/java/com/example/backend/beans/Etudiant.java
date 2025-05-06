package com.example.backend.beans;

import com.example.backend.security.Role;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Etudiant extends Utilisateur {
    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    private List<Tentative> tentatives = new ArrayList<>();

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    private List<ReponseEtudiant> reponses = new ArrayList<>();

    // Constructeur par défaut requis par JPA
    public Etudiant() {
        super();
        setRole(Role.student);
    }

    public Etudiant(String nom, String prenom, String email, String motDePasse) {
        super(nom, prenom, email, motDePasse);
        setRole(Role.student);
    }

    // Getters and Setters
    public List<Tentative> getTentatives() {
        return tentatives;
    }

    public void setTentatives(List<Tentative> tentatives) {
        this.tentatives = tentatives;
    }

    public void addTentative(Tentative tentative) {
        tentatives.add(tentative);
        tentative.setEtudiant(this);
    }

    public List<ReponseEtudiant> getReponses() {
        return reponses;
    }

    public void setReponses(List<ReponseEtudiant> reponses) {
        this.reponses = reponses;
    }

    public void addReponse(ReponseEtudiant reponse) {
        reponses.add(reponse);
        reponse.setEtudiant(this);
    }
}
