package com.example.backend.security;

import com.example.backend.beans.Utilisateur;
import com.example.backend.dao.EtudiantRepository;
import com.example.backend.dao.ProfesseurRepository;
import com.example.backend.dao.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;
    private final ProfesseurRepository professeurRepository;
    private final EtudiantRepository etudiantRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email));

        return switch (utilisateur.getRole()) {
            case PROFESSOR -> professeurRepository.findById(utilisateur.getId())
                    .orElseThrow(() -> new UsernameNotFoundException("Professeur introuvable"));
            case STUDENT -> etudiantRepository.findById(utilisateur.getId())
                    .orElseThrow(() -> new UsernameNotFoundException("Etudiant introuvable"));
            default -> utilisateur; // for ADMIN or base users
        };
    }
}
