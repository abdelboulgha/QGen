package com.example.backend.controller;

import com.example.backend.beans.Quiz;
import com.example.backend.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("/public")
    public List<Quiz> getPublicQuizzes() {
        return quizService.getPublicQuizzes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        Optional<Quiz> quiz = quizService.getQuizById(id);
        return quiz.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/professeur/{professeurId}")
    public List<Quiz> getQuizzesByProfesseur(@PathVariable Long professeurId) {
        return quizService.getQuizzesByProfesseur(professeurId);
    }

    @PostMapping("/professeur/{professeurId}")
    public Quiz createQuiz(@RequestBody Quiz quiz, @PathVariable Long professeurId) {
        return quizService.createQuiz(quiz, professeurId);
    }

    @PutMapping
    public Quiz updateQuiz(@RequestBody Quiz quiz) {
        return quizService.updateQuiz(quiz);
    }

    @PutMapping("/{id}/publish")
    public ResponseEntity<Void> publishQuiz(@PathVariable Long id) {
        quizService.publishQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
}
