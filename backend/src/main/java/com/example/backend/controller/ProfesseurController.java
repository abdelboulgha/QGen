package com.example.backend.controller;

import com.example.backend.beans.Professeur;
import com.example.backend.service.ProfesseurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/professeurs")
public class ProfesseurController {

    @Autowired
    private ProfesseurService professeurService;

    @GetMapping
    public List<Professeur> getAllProfesseurs() {
        return professeurService.getAllProfesseurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professeur> getProfesseurById(@PathVariable Long id) {
        Optional<Professeur> professeur = professeurService.getProfesseurById(id);
        return professeur.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Professeur createProfesseur(@RequestBody Professeur professeur) {
        return professeurService.saveProfesseur(professeur);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesseur(@PathVariable Long id) {
        professeurService.deleteProfesseur(id);
        return ResponseEntity.noContent().build();
    }
}
