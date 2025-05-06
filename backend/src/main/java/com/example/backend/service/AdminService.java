package com.example.backend.service;

import com.example.backend.beans.Admin;
import com.example.backend.beans.Etudiant;
import com.example.backend.beans.Professeur;
import com.example.backend.beans.Utilisateur;
import com.example.backend.dao.AdminRepository;
import com.example.backend.security.Role;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    private final AdminRepository adminRepository;
    private final ProfesseurService professeurService;
    private final EtudiantService etudiantService;
    private final UtilisateurService utilisateurService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository,
                        ProfesseurService professeurService,
                        EtudiantService etudiantService,
                        UtilisateurService utilisateurService,
                        EmailService emailService,
                        PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.professeurService = professeurService;
        this.etudiantService = etudiantService;
        this.utilisateurService = utilisateurService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin saveAdmin(Admin admin) {
        // Encode the password before saving
        admin.setMotDePasse(passwordEncoder.encode(admin.getMotDePasse()));
        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    /**
     * Crée un utilisateur selon le rôle spécifié et envoie un email avec les identifiants
     * @param nom Le nom de l'utilisateur
     * @param prenom Le prénom de l'utilisateur
     * @param email L'email de l'utilisateur
     * @param motDePasse Le mot de passe de l'utilisateur
     * @param role Le rôle de l'utilisateur ("ADMIN", "PROFESSEUR", "ETUDIANT")
     * @return L'utilisateur créé
     * @throws IllegalArgumentException si le rôle n'est pas reconnu
     */

    public Utilisateur createUtilisateurByRole(String nom, String prenom, String email,
                                               String motDePasse, String role) {
        Utilisateur utilisateur = null;
        String encodedPassword = passwordEncoder.encode(motDePasse);

        // Convertir le rôle en Role enum
        Role roleEnum;
        try {
            roleEnum = Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rôle non reconnu: " + role);
        }

        switch (roleEnum) {
            case ADMIN:
                Admin admin = new Admin(nom, prenom, email, encodedPassword);
                admin.setMustChangePassword(true); // Force le changement de mot de passe
                utilisateur = adminRepository.save(admin);
                sendCredentialsByEmail(utilisateur, roleEnum.toString()); // Envoyer email aussi pour les admins
                break;

            case PROFESSOR:
                Professeur professeur = new Professeur();
                professeur.setNom(nom);
                professeur.setPrenom(prenom);
                professeur.setEmail(email);
                professeur.setMotDePasse(encodedPassword);
                professeur.setMustChangePassword(true); // Force le changement de mot de passe
                utilisateur = professeurService.saveProfesseur(professeur);
                sendCredentialsByEmail(utilisateur, roleEnum.toString());
                break;

            case STUDENT:
                Etudiant etudiant = new Etudiant(nom, prenom, email, encodedPassword);
                etudiant.setMustChangePassword(true); // Force le changement de mot de passe
                utilisateur = etudiantService.saveEtudiant(etudiant);
                sendCredentialsByEmail(utilisateur, roleEnum.toString());
                break;

            default:
                throw new IllegalArgumentException("Rôle non reconnu: " + role);
        }

        return utilisateur;
    }

    /**
     * Envoie un email avec les identifiants de connexion
     * @param utilisateur L'utilisateur destinataire
     * @param role Le rôle de l'utilisateur
     */
    private void sendCredentialsByEmail(Utilisateur utilisateur, String role) {
        try {
            emailService.sendCredentialsEmail(utilisateur, role);
            logger.info("Email d'identification envoyé à {} {}", utilisateur.getPrenom(), utilisateur.getNom());
        } catch (MessagingException e) {
            logger.error("Erreur lors de l'envoi de l'email: {}", e.getMessage());
            // Ne pas bloquer la création de l'utilisateur si l'envoi d'email échoue
            // Mais on pourrait également lancer une exception selon les besoins métier
        }
    }
}
