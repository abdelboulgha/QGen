package com.example.backend.controller;

import com.example.backend.beans.ReponseEtudiant;
import com.example.backend.service.ReponseEtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reponses-etudiant")
public class ReponseEtudiantController {

    @Autowired
    private ReponseEtudiantService reponseEtudiantService;

    @GetMapping
    public List<ReponseEtudiant> getAllReponses() {
        return reponseEtudiantService.getAllReponses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReponseEtudiant> getReponseById(@PathVariable Long id) {
        Optional<ReponseEtudiant> reponse = reponseEtudiantService.getReponseById(id);
        return reponse.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/tentative/{tentativeId}")
    public List<ReponseEtudiant> getReponsesByTentative(@PathVariable Long tentativeId) {
        return reponseEtudiantService.getReponsesByTentative(tentativeId);
    }

    @GetMapping("/question/{questionId}")
    public List<ReponseEtudiant> getReponsesByQuestion(@PathVariable Long questionId) {
        return reponseEtudiantService.getReponsesByQuestion(questionId);
    }

    @PostMapping
    public ReponseEtudiant soumettreReponse(
            @RequestParam String valeurReponse,
            @RequestParam Long etudiantId,
            @RequestParam Long questionId,
            @RequestParam Long tentativeId) {
        return reponseEtudiantService.soumettreReponse(valeurReponse, etudiantId, questionId, tentativeId);
    }

    @PutMapping
    public ReponseEtudiant updateReponse(@RequestBody ReponseEtudiant reponse) {
        return reponseEtudiantService.updateReponse(reponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReponse(@PathVariable Long id) {
        reponseEtudiantService.deleteReponse(id);
        return ResponseEntity.noContent().build();
    }
}
