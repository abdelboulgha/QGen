package com.example.backend.security;

import com.example.backend.beans.Utilisateur;
import com.example.backend.dao.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole())
                .mustChangePassword(user.isMustChangePassword())
                .build();
    }

    public void changePassword(Utilisateur user, ChangePasswordRequest request) {
        // Vérifier si l'ancien mot de passe est correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mot de passe actuel incorrect");
        }

        // Vérifier si le nouveau mot de passe et sa confirmation correspondent
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Le nouveau mot de passe et sa confirmation ne correspondent pas");
        }

        // Vérifier la force du mot de passe (à ajouter)
        if (!isStrongPassword(request.getNewPassword())) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial");
        }

        // Mettre à jour le mot de passe
        user.setMotDePasse(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        utilisateurRepository.save(user);
    }

    private boolean isStrongPassword(String password) {
        // Au moins 8 caractères
        if (password.length() < 8) {
            return false;
        }

        // Au moins une majuscule
        if (!password.matches(".*[A-Z].*")) {
            return false;
        }

        // Au moins une minuscule
        if (!password.matches(".*[a-z].*")) {
            return false;
        }

        // Au moins un chiffre
        if (!password.matches(".*\\d.*")) {
            return false;
        }

        // Au moins un caractère spécial
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            return false;
        }

        return true;
    }
}