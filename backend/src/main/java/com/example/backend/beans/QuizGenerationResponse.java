package com.example.backend.beans;

import java.util.List;

public class QuizGenerationResponse {
    private Quiz quiz;
    private String message;
    private boolean success;

    public QuizGenerationResponse() {
    }

    public QuizGenerationResponse(Quiz quiz, String message, boolean success) {
        this.quiz = quiz;
        this.message = message;
        this.success = success;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}