package com.example.backend.controller;

import com.example.backend.beans.Etudiant;
import com.example.backend.service.EtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etudiants")
public class EtudiantController {

    @Autowired
    private EtudiantService etudiantService;

    @GetMapping
    public List<Etudiant> getAllEtudiants() {
        return etudiantService.getAllEtudiants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getEtudiantById(@PathVariable Long id) {
        Optional<Etudiant> etudiant = etudiantService.getEtudiantById(id);
        return etudiant.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Etudiant createEtudiant(@RequestBody Etudiant etudiant) {
        return etudiantService.saveEtudiant(etudiant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etudiant> updateEtudiant(@PathVariable Long id, @RequestBody Etudiant etudiantDetails) {
        Optional<Etudiant> optionalEtudiant = etudiantService.getEtudiantById(id);

        if (!optionalEtudiant.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Etudiant existingEtudiant = optionalEtudiant.get();

        // Mettre à jour les propriétés modifiables
        if (etudiantDetails.getNom() != null) {
            existingEtudiant.setNom(etudiantDetails.getNom());
        }
        if (etudiantDetails.getPrenom() != null) {
            existingEtudiant.setPrenom(etudiantDetails.getPrenom());
        }
        if (etudiantDetails.getEmail() != null) {
            existingEtudiant.setEmail(etudiantDetails.getEmail());
        }
        if (etudiantDetails.getMotDePasse() != null) {
            existingEtudiant.setMotDePasse(etudiantDetails.getMotDePasse());
        }

        // Sauvegarder les modifications
        Etudiant updatedEtudiant = etudiantService.saveEtudiant(existingEtudiant);
        return ResponseEntity.ok(updatedEtudiant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtudiant(@PathVariable Long id) {
        etudiantService.deleteEtudiant(id);
        return ResponseEntity.noContent().build();
    }
}