package com.example.backend.dao;

import com.example.backend.beans.ReponseEtudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReponseEtudiantRepository extends JpaRepository<ReponseEtudiant, Long> {
    List<ReponseEtudiant> findByTentativeId(Long tentativeId);
    List<ReponseEtudiant> findByQuestionId(Long questionId);
}
