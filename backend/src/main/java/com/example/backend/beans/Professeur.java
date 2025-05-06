package com.example.backend.beans;

import com.example.backend.security.Role;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Professeur extends Utilisateur {
    @OneToMany(mappedBy = "createur", cascade = CascadeType.ALL)
    private List<Quiz> quizzesCrees;

    // Constructeurs
    public Professeur() {
        super();
        setRole(Role.PROFESSOR);
    }

    public Professeur(String nom, String prenom, String email, String motDePasse) {
        super(nom, prenom, email, motDePasse);
        setRole(Role.PROFESSOR);
    }

    // Getters and Setters
    public List<Quiz> getQuizzesCrees() {
        return quizzesCrees;
    }

    public void setQuizzesCrees(List<Quiz> quizzesCrees) {
        this.quizzesCrees = quizzesCrees;
    }
}
