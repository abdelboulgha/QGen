package com.example.backend.service;

import com.example.backend.beans.Professeur;
import com.example.backend.dao.ProfesseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfesseurService {

    private final ProfesseurRepository professeurRepository;

    @Autowired
    public ProfesseurService(ProfesseurRepository professeurRepository) {
        this.professeurRepository = professeurRepository;
    }

    public List<Professeur> getAllProfesseurs() {
        return professeurRepository.findAll();
    }

    public Optional<Professeur> getProfesseurById(Long id) {
        return professeurRepository.findById(id);
    }

    public Professeur saveProfesseur(Professeur professeur) {
        return professeurRepository.save(professeur);
    }

    public void deleteProfesseur(Long id) {
        professeurRepository.deleteById(id);
    }

    public Professeur updateProfesseur(Long id, Professeur professeurDetails) {
        return professeurRepository.findById(id)
                .map(existingProfesseur -> {
                    // Mise à jour des champs non-nulls
                    if (professeurDetails.getNom() != null) {
                        existingProfesseur.setNom(professeurDetails.getNom());
                    }
                    if (professeurDetails.getPrenom() != null) {
                        existingProfesseur.setPrenom(professeurDetails.getPrenom());
                    }
                    if (professeurDetails.getEmail() != null) {
                        // Vérification de l'unicité de l'email
                        if (!existingProfesseur.getEmail().equals(professeurDetails.getEmail()) &&
                                professeurRepository.existsByEmail(professeurDetails.getEmail())) {
                            throw new RuntimeException("Email déjà utilisé par un autre professeur");
                        }
                        existingProfesseur.setEmail(professeurDetails.getEmail());
                    }
                    if (professeurDetails.getMotDePasse() != null) {
                        existingProfesseur.setMotDePasse(professeurDetails.getMotDePasse());
                    }
                    // Ajoutez d'autres champs si nécessaire

                    return professeurRepository.save(existingProfesseur);
                })
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé avec l'id: " + id));
    }
}
