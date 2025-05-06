package com.example.backend.controller;

import com.example.backend.beans.Tentative;
import com.example.backend.service.TentativeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tentatives")
public class TentativeController {

    @Autowired
    private TentativeService tentativeService;

    @GetMapping
    public List<Tentative> getAllTentatives() {
        return tentativeService.getAllTentatives();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tentative> getTentativeById(@PathVariable Long id) {
        Optional<Tentative> tentative = tentativeService.getTentativeById(id);
        return tentative.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/etudiant/{etudiantId}")
    public List<Tentative> getTentativesByEtudiant(@PathVariable Long etudiantId) {
        return tentativeService.getTentativesByEtudiant(etudiantId);
    }

    @GetMapping("/quiz/{quizId}")
    public List<Tentative> getTentativesByQuiz(@PathVariable Long quizId) {
        return tentativeService.getTentativesByQuiz(quizId);
    }

    @PostMapping
    public Tentative demarrerTentative(@RequestParam Long etudiantId, @RequestParam Long quizId) {
        return tentativeService.demarrerTentative(etudiantId, quizId);
    }

    @PutMapping("/{id}/terminer")
    public Tentative terminerTentative(@PathVariable Long id) {
        return tentativeService.terminerTentative(id);
    }

    @PutMapping("/{id}/calculer-score")
    public Tentative calculerScore(@PathVariable Long id) {
        return tentativeService.calculerScore(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTentative(@PathVariable Long id) {
        tentativeService.deleteTentative(id);
        return ResponseEntity.noContent().build();
    }
}
