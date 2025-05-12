package com.example.backend.security;

import com.example.backend.beans.Utilisateur;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {


    public static Utilisateur getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Utilisateur utilisateur) {
            return utilisateur;
        }
        return null;
    }

    public static Long getAuthenticatedUserId() {
        Utilisateur user = getAuthenticatedUser();
        return (user != null) ? user.getId() : null;
    }

    public static String getAuthenticatedEmail() {
        Utilisateur user = getAuthenticatedUser();
        return (user != null) ? user.getEmail() : null;
    }
}
