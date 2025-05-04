package com.example.backend.beans;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String enonce;
    private int points;

    @Enumerated(EnumType.STRING)
    private TypeQuestion type;

    private String theme;
    private String niveauDifficulte;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReponseEtudiant> reponses;

    // Getters and Setters
    // Constructors


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEnonce() {
        return enonce;
    }

    public void setEnonce(String enonce) {
        this.enonce = enonce;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public TypeQuestion getType() {
        return type;
    }

    public void setType(TypeQuestion type) {
        this.type = type;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getNiveauDifficulte() {
        return niveauDifficulte;
    }

    public void setNiveauDifficulte(String niveauDifficulte) {
        this.niveauDifficulte = niveauDifficulte;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public List<ReponseEtudiant> getReponses() {
        return reponses;
    }

    public void setReponses(List<ReponseEtudiant> reponses) {
        this.reponses = reponses;
    }
}
