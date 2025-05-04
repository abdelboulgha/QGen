package com.example.backend.service;

import com.example.backend.beans.Utilisateur;
import com.example.backend.dao.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    public Utilisateur saveUtilisateur(Utilisateur utilisateur) {
        // Aucun encodage de mot de passe
        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUtilisateur(Long id) {
        utilisateurRepository.deleteById(id);
    }

    public boolean authenticate(String email, String password) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email);
        if (utilisateur != null) {
            // Comparaison directe des mots de passe sans encodage
            return password.equals(utilisateur.getMotDePasse());
        }
        return false;
    }
}