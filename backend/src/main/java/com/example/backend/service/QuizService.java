package com.example.backend.service;

import com.example.backend.beans.Professeur;
import com.example.backend.beans.Quiz;
import com.example.backend.dao.ProfesseurRepository;
import com.example.backend.dao.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final ProfesseurRepository professeurRepository;

    @Autowired
    public QuizService(QuizRepository quizRepository, ProfesseurRepository professeurRepository) {
        this.quizRepository = quizRepository;
        this.professeurRepository = professeurRepository;
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    public List<Quiz> getPublicQuizzes() {
        return quizRepository.findByEstPublic(true);
    }

    public List<Quiz> getQuizzesByProfesseur(Long professeurId) {
        return quizRepository.findByCreateurId(professeurId);
    }

    public Quiz createQuiz(Quiz quiz, Long professeurId) {
        Optional<Professeur> professeur = professeurRepository.findById(professeurId);
        if (professeur.isPresent()) {
            quiz.setCreateur(professeur.get());
            quiz.setDateCreation(new Date());
            return quizRepository.save(quiz);
        }
        return null;
    }

    public Quiz updateQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public void publishQuiz(Long quizId) {
        Optional<Quiz> optionalQuiz = quizRepository.findById(quizId);
        if (optionalQuiz.isPresent()) {
            Quiz quiz = optionalQuiz.get();
            quiz.setDatePublication(new Date());
            quiz.setEstPublic(true);
            quizRepository.save(quiz);
        }
    }

    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }
}
