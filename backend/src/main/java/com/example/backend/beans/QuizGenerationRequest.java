package com.example.backend.beans;

public class QuizGenerationRequest {
    private String titre;
    private String description;
    private int duree; // en minutes
    private boolean estPublic;
    private boolean correctionImmediate;
    private int nombreQuestions;

    public QuizGenerationRequest() {
    }

    public QuizGenerationRequest(String titre, String description, int duree, boolean estPublic,
                                 boolean correctionImmediate, int nombreQuestions) {
        this.titre = titre;
        this.description = description;
        this.duree = duree;
        this.estPublic = estPublic;
        this.correctionImmediate = correctionImmediate;
        this.nombreQuestions = nombreQuestions;
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

    public int getNombreQuestions() {
        return nombreQuestions;
    }

    public void setNombreQuestions(int nombreQuestions) {
        this.nombreQuestions = nombreQuestions;
    }
}