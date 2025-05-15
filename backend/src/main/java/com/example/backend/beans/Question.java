package com.example.backend.beans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
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


    @ManyToOne
    @JoinColumn(name = "quiz_id")
    @JsonIgnore()
    private Quiz quiz;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReponseEtudiant> reponses;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionOption> options = new ArrayList<>();

    // Getters and Setters
    // Constructors

    public Question() {
    }

    public Question(String enonce, int points, TypeQuestion type) {
        this.enonce = enonce;
        this.points = points;
        this.type = type;
    }


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

    public List<QuestionOption> getOptions() {
        return options;
    }
    public void setOptions(List<QuestionOption> options) {
        this.options = options;
    }
    public void addOption(QuestionOption option) {
        options.add(option);
        option.setQuestion(this);
    }

    @Override
    public String toString() {
        return "Question{" +
                "enonce='" + enonce + '\'' +
                ", points=" + points +
                ", type=" + type +
                ", options=" + options +
                '}';
    }
}
