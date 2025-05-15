package com.example.backend.controller;

import com.example.backend.beans.Quiz;
import com.example.backend.dao.ProfesseurRepository;
import com.example.backend.security.SecurityUtil;
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
    private ProfesseurRepository professeurRepository;


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

    @PostMapping
    public Quiz createQuiz(@RequestBody String quiz) {
        System.err.println("Response : " + quiz);
        return quizService.createQuizFromJson(quiz);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuizWithQuestionsPartially(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        try {
            Quiz quiz = quizService.updateQuizWithQuestionsPartially(id, updatedQuiz);
            return ResponseEntity.ok(quiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
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

    @GetMapping("/professeur/summaries/{professeurId}")
    public List<Object[]> getQuizSummariesByProf(@PathVariable Long professeurId) {
        return quizService.getQuizSummariesByProfesseur(professeurId);
    }
}
