package com.example.backend.security;


public enum Role {
    ADMIN,
    PROFESSOR,
    STUDENT;

    @Override
    public String toString() {
        return name().toLowerCase();
    }

}
