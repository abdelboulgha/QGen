package com.example.backend.security;


public enum Role {
    ADMIN,
    PROFESSEUR,
    ETUDIANT;

    @Override
    public String toString() {
        return name().toLowerCase();
    }

}
