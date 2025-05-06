package com.example.backend.service;

import com.example.backend.beans.Etudiant;
import com.example.backend.beans.Question;
import com.example.backend.beans.ReponseEtudiant;
import com.example.backend.beans.Tentative;
import com.example.backend.dao.EtudiantRepository;
import com.example.backend.dao.QuestionRepository;
import com.example.backend.dao.ReponseEtudiantRepository;
import com.example.backend.dao.TentativeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReponseEtudiantService {

    private final ReponseEtudiantRepository reponseEtudiantRepository;
    private final EtudiantRepository etudiantRepository;
    private final QuestionRepository questionRepository;
    private final TentativeRepository tentativeRepository;

    @Autowired
    public ReponseEtudiantService(ReponseEtudiantRepository reponseEtudiantRepository,
                                  EtudiantRepository etudiantRepository,
                                  QuestionRepository questionRepository,
                                  TentativeRepository tentativeRepository) {
        this.reponseEtudiantRepository = reponseEtudiantRepository;
        this.etudiantRepository = etudiantRepository;
        this.questionRepository = questionRepository;
        this.tentativeRepository = tentativeRepository;
    }

    public List<ReponseEtudiant> getAllReponses() {
        return reponseEtudiantRepository.findAll();
    }

    public Optional<ReponseEtudiant> getReponseById(Long id) {
        return reponseEtudiantRepository.findById(id);
    }

    public List<ReponseEtudiant> getReponsesByTentative(Long tentativeId) {
        return reponseEtudiantRepository.findByTentativeId(tentativeId);
    }

    public List<ReponseEtudiant> getReponsesByQuestion(Long questionId) {
        return reponseEtudiantRepository.findByQuestionId(questionId);
    }

    public ReponseEtudiant soumettreReponse(String valeurReponse,
                                            Long etudiantId,
                                            Long questionId,
                                            Long tentativeId) {
        Optional<Etudiant> etudiant = etudiantRepository.findById(etudiantId);
        Optional<Question> question = questionRepository.findById(questionId);
        Optional<Tentative> tentative = tentativeRepository.findById(tentativeId);

        if (etudiant.isPresent() && question.isPresent() && tentative.isPresent()) {
            ReponseEtudiant reponse = new ReponseEtudiant();
            reponse.setValeurReponse(valeurReponse);
            reponse.setEtudiant(etudiant.get());
            reponse.setQuestion(question.get());
            reponse.setTentative(tentative.get());

            // Vérification de la réponse (à implémenter selon le type de question)
            boolean estCorrecte = verifierReponse(valeurReponse, question.get());
            reponse.setEstCorrecte(estCorrecte);

            // Feedback en fonction de la correction
            if (tentative.get().getQuiz().isCorrectionImmediate()) {
                reponse.setFeedback(estCorrecte ? "Bonne réponse !" : "Réponse incorrecte.");
            }

            return reponseEtudiantRepository.save(reponse);
        }
        return null;
    }

    // Logique de vérification des réponses à adapter selon le type de question
    private boolean verifierReponse(String valeurReponse, Question question) {
        // Implémentation à adapter selon le type de question (QCM, QCU, REPONSE_COURTE)
        // Pour l'exemple, nous supposons une correspondance exacte
        switch (question.getType()) {
            case QCM:
                // Logique pour vérifier QCM
                return true; // À implémenter
            case QCU:
                // Logique pour vérifier QCU
                return true; // À implémenter
            case REPONSE_COURTE:
                // Logique pour vérifier REPONSE_COURTE
                return true; // À implémenter
            default:
                return false;
        }
    }

    public ReponseEtudiant updateReponse(ReponseEtudiant reponse) {
        return reponseEtudiantRepository.save(reponse);
    }

    public void deleteReponse(Long id) {
        reponseEtudiantRepository.deleteById(id);
    }
}
