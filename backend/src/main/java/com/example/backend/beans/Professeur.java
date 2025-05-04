package com.example.backend.beans;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Professeur extends Utilisateur {
    @OneToMany(mappedBy = "createur", cascade = CascadeType.ALL)
    private List<Quiz> quizzesCrees;

    // Getters and Setters
    // Constructors


    public List<Quiz> getQuizzesCrees() {
        return quizzesCrees;
    }

    public void setQuizzesCrees(List<Quiz> quizzesCrees) {
        this.quizzesCrees = quizzesCrees;
    }
}
