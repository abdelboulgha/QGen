package com.example.backend.beans;


import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    private int duree; // in minutes
    private Date dateCreation;
    private Date datePublication;
    private boolean estPublic;
    private boolean correctionImmediate;

    @ManyToOne
    @JoinColumn(name = "professeur_id")
    private Professeur createur;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<Tentative> tentatives;

    // Getters and Setters
    // Constructors

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDuree() {
        return duree;
    }

    public void setDuree(int duree) {
        this.duree = duree;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Date getDatePublication() {
        return datePublication;
    }

    public void setDatePublication(Date datePublication) {
        this.datePublication = datePublication;
    }

    public boolean isEstPublic() {
        return estPublic;
    }

    public void setEstPublic(boolean estPublic) {
        this.estPublic = estPublic;
    }

    public boolean isCorrectionImmediate() {
        return correctionImmediate;
    }

    public void setCorrectionImmediate(boolean correctionImmediate) {
        this.correctionImmediate = correctionImmediate;
    }

    public Professeur getCreateur() {
        return createur;
    }

    public void setCreateur(Professeur createur) {
        this.createur = createur;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public List<Tentative> getTentatives() {
        return tentatives;
    }

    public void setTentatives(List<Tentative> tentatives) {
        this.tentatives = tentatives;
    }
}
