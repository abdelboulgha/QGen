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

    @PutMapping("/{id}")
    public ResponseEntity<Professeur> updateProfesseur(@PathVariable Long id, @RequestBody Professeur professeurDetails) {
        Optional<Professeur> professeurOptional = professeurService.getProfesseurById(id);

        if (professeurOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Professeur existingProfesseur = professeurOptional.get();

        // Mettre à jour les champs nécessaires
        if (professeurDetails.getNom() != null) {
            existingProfesseur.setNom(professeurDetails.getNom());
        }
        if (professeurDetails.getPrenom() != null) {
            existingProfesseur.setPrenom(professeurDetails.getPrenom());
        }
        // Ajouter d'autres champs à mettre à jour selon votre modèle Professeur

        Professeur updatedProfesseur = professeurService.saveProfesseur(existingProfesseur);
        return ResponseEntity.ok(updatedProfesseur);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesseur(@PathVariable Long id) {
        professeurService.deleteProfesseur(id);
        return ResponseEntity.noContent().build();
    }
}
