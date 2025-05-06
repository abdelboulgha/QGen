package com.example.backend.service;

import com.example.backend.beans.Etudiant;
import com.example.backend.beans.Quiz;
import com.example.backend.beans.ReponseEtudiant;
import com.example.backend.beans.Tentative;
import com.example.backend.dao.EtudiantRepository;
import com.example.backend.dao.QuizRepository;
import com.example.backend.dao.TentativeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TentativeService {

    private final TentativeRepository tentativeRepository;
    private final EtudiantRepository etudiantRepository;
    private final QuizRepository quizRepository;

    @Autowired
    public TentativeService(TentativeRepository tentativeRepository,
                            EtudiantRepository etudiantRepository,
                            QuizRepository quizRepository) {
        this.tentativeRepository = tentativeRepository;
        this.etudiantRepository = etudiantRepository;
        this.quizRepository = quizRepository;
    }

    public List<Tentative> getAllTentatives() {
        return tentativeRepository.findAll();
    }

    public Optional<Tentative> getTentativeById(Long id) {
        return tentativeRepository.findById(id);
    }

    public List<Tentative> getTentativesByEtudiant(Long etudiantId) {
        return tentativeRepository.findByEtudiantId(etudiantId);
    }

    public List<Tentative> getTentativesByQuiz(Long quizId) {
        return tentativeRepository.findByQuizId(quizId);
    }

    public Tentative demarrerTentative(Long etudiantId, Long quizId) {
        Optional<Etudiant> etudiant = etudiantRepository.findById(etudiantId);
        Optional<Quiz> quiz = quizRepository.findById(quizId);

        if (etudiant.isPresent() && quiz.isPresent()) {
            Tentative tentative = new Tentative();
            tentative.setEtudiant(etudiant.get());
            tentative.setQuiz(quiz.get());
            tentative.setDateDebut(new Date());
            tentative.setScore(0);

            return tentativeRepository.save(tentative);
        }
        return null;
    }

    public Tentative terminerTentative(Long tentativeId) {
        Optional<Tentative> optionalTentative = tentativeRepository.findById(tentativeId);
        if (optionalTentative.isPresent()) {
            Tentative tentative = optionalTentative.get();
            tentative.setDateFin(new Date());

            // Calculate duration in seconds
            long durationInSeconds = (tentative.getDateFin().getTime() - tentative.getDateDebut().getTime()) / 1000;
            tentative.setDureeEffective((int) durationInSeconds);

            return tentativeRepository.save(tentative);
        }
        return null;
    }

    public Tentative calculerScore(Long tentativeId) {
        Optional<Tentative> optionalTentative = tentativeRepository.findById(tentativeId);
        if (optionalTentative.isPresent()) {
            Tentative tentative = optionalTentative.get();
            int totalScore = 0;

            // Calculate score based on correct answers
            for (ReponseEtudiant reponse : tentative.getReponses()) {
                if (reponse.isEstCorrecte()) {
                    totalScore += reponse.getQuestion().getPoints();
                }
            }

            tentative.setScore(totalScore);
            return tentativeRepository.save(tentative);
        }
        return null;
    }

    public void deleteTentative(Long id) {
        tentativeRepository.deleteById(id);
    }
}
