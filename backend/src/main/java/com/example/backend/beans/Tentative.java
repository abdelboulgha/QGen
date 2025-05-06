package com.example.backend.beans;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Tentative {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date dateDebut;
    private Date dateFin;
    private int dureeEffective; // in seconds
    private int score;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @OneToMany(mappedBy = "tentative", cascade = CascadeType.ALL)
    private List<ReponseEtudiant> reponses;

    // Getters and Setters
    // Constructors


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Date getDateFin() {
        return dateFin;
    }

    public void setDateFin(Date dateFin) {
        this.dateFin = dateFin;
    }

    public int getDureeEffective() {
        return dureeEffective;
    }

    public void setDureeEffective(int dureeEffective) {
        this.dureeEffective = dureeEffective;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public Etudiant getEtudiant() {
        return etudiant;
    }

    public void setEtudiant(Etudiant etudiant) {
        this.etudiant = etudiant;
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
