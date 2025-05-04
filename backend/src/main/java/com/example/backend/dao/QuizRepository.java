package com.example.backend.dao;

import com.example.backend.beans.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByEstPublic(boolean estPublic);
    List<Quiz> findByCreateurId(Long professeurId);
}
