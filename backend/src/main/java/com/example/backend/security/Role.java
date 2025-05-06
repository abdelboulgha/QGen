package com.example.backend.security;


public enum Role {
    admin,
    professor,
    student;

    @Override
    public String toString() {
        return name().toLowerCase();
    }

}
