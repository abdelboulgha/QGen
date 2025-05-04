package com.example.backend.dao;

import com.example.backend.beans.Tentative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TentativeRepository extends JpaRepository<Tentative, Long> {
    List<Tentative> findByEtudiantId(Long etudiantId);
    List<Tentative> findByQuizId(Long quizId);
}
