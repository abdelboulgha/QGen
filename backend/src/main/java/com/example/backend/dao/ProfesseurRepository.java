package com.example.backend.dao;

import com.example.backend.beans.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfesseurRepository extends JpaRepository<Professeur, Long> {

    boolean existsByEmail(String email);
}
