package com.example.backend.controller;

import com.example.backend.beans.Utilisateur;
import com.example.backend.security.AuthRequest;
import com.example.backend.security.AuthResponse;
import com.example.backend.security.AuthenticationService;
import com.example.backend.security.ChangePasswordRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        // La vérification mustChangePassword est déjà dans la réponse
        // Le client pourra utiliser cette information pour rediriger vers la page de changement de mot de passe
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal Utilisateur user
    ) {
        authService.changePassword(user, request);
        return ResponseEntity.ok().build();
    }
}