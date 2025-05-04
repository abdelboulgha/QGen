package com.example.backend.controller;

import com.example.backend.beans.Admin;
import com.example.backend.beans.Utilisateur;
import com.example.backend.service.AdminService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        Optional<Admin> admin = adminService.getAdminById(id);
        return admin.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.saveAdmin(admin);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint permettant à un admin de créer un utilisateur avec un rôle spécifique
     * @param userData Map contenant les informations de l'utilisateur à créer
     * @return L'utilisateur créé avec son id et un message sur l'envoi d'email
     */
    @PostMapping("/create-user")
    public ResponseEntity<?> createUserByRole(@RequestBody Map<String, String> userData) {
        try {
            // Extraction des données du Map
            String nom = userData.get("nom");
            String prenom = userData.get("prenom");
            String email = userData.get("email");
            String motDePasse = userData.get("motDePasse");
            String role = userData.get("role");

            // Validation des données requises
            if (nom == null || prenom == null || email == null || motDePasse == null || role == null) {
                return ResponseEntity.badRequest().body("Tous les champs sont requis : nom, prenom, email, motDePasse, role");
            }

            // Création de l'utilisateur
            Utilisateur createdUser = adminService.createUtilisateurByRole(nom, prenom, email, motDePasse, role);

            // Préparer la réponse avec des informations supplémentaires
            Map<String, Object> response = new HashMap<>();
            response.put("utilisateur", createdUser);
            response.put("message", "Utilisateur créé avec succès. Un email contenant les identifiants a été envoyé à l'adresse " + email);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création de l'utilisateur: " + e.getMessage());
        }
    }

}