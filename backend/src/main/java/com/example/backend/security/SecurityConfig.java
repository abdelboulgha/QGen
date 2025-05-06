package com.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login").permitAll() // Autoriser l'accès à l'authentification
                        .requestMatchers("/api/auth/change-password").permitAll()
                        .requestMatchers("/api/admins/create-user").permitAll()
                        .requestMatchers("/api/admins/create-user").permitAll()// Nécessite une authentification
                        //.requestMatchers("/api/admins/**").hasRole("ADMIN") // Réservé aux admins
                        .requestMatchers("/api/admins/**").permitAll()
                        .requestMatchers("/api/professeurs/**").hasAnyRole("ADMIN", "PROFESSOR") // Admin et profs
                        .requestMatchers("/api/etudiants/**").hasAnyRole("ADMIN", "PROFESSOR") // Admin et profs
                        .requestMatchers("/api/utilisateurs/**").hasRole("ADMIN") // Réservé aux admins
                        // Les accès aux quiz dépendent du contexte métier
                        .requestMatchers("/api/quizzes/**").authenticated()
                        .requestMatchers("/api/questions/**").authenticated()
                        .requestMatchers("/api/tentatives/**").authenticated()
                        .requestMatchers("/api/reponses/**").authenticated()
                        .requestMatchers("/api/notifications/**").authenticated()
                        .anyRequest().authenticated() // Toute autre requête doit être authentifiée
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*"); // Configurer selon vos besoins
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");

        configuration.setAllowCredentials(false); // Ajoutez cette ligne


        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}