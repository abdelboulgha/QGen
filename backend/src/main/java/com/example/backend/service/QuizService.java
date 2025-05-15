package com.example.backend.service;

import com.example.backend.beans.*;
import com.example.backend.dao.ProfesseurRepository;
import com.example.backend.dao.QuizRepository;
import com.example.backend.security.SecurityUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final ProfesseurRepository professeurRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final QuestionOptionService questionOptionService;
    private final QuestionService questionService;

    @Autowired
    public QuizService(QuizRepository quizRepository, ProfesseurRepository professeurRepository, QuestionOptionService questionOptionService, QuestionService questionService) {
        this.quizRepository = quizRepository;
        this.professeurRepository = professeurRepository;
        this.questionOptionService = questionOptionService;
        this.questionService = questionService;
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
            Quiz savedQuiz = quizRepository.save(quiz);
            for (Question question : quiz.getQuestions()) {
                Question savedQuestion = questionService.createQuestion(question, savedQuiz.getId());
                for (QuestionOption option : question.getOptions()) {
                    questionOptionService.createQuestionOption(option, savedQuestion.getId());
                }
            }
            return savedQuiz;
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

    private String extractJsonFromResponse(String response) {
        int startIndex = response.indexOf('{');
        int endIndex = response.lastIndexOf('}') + 1;

        if (startIndex >= 0 && endIndex > startIndex) {
            return response.substring(startIndex, endIndex);
        }

        throw new IllegalArgumentException("Impossible de trouver un objet JSON dans la réponse");
    }

    public Quiz createQuizFromJson(String response) {
        try {
            JsonNode root = objectMapper.readTree(response).path("quiz");
            Quiz quiz = new Quiz();
            quiz.setTitre(root.path("titre").asText(""));
            quiz.setDescription(root.path("description").asText(""));
            quiz.setDuree(root.path("duree").asInt(15));
            List<Question> questions = new ArrayList<>();
            for (JsonNode q : root.path("questions")) {
                Question question = new Question();
                question.setEnonce(q.path("enonce").asText());
                question.setPoints(q.path("points").asInt(1));
                question.setType(TypeQuestion.QCU);
                List<QuestionOption> options = new ArrayList<>();
                for (JsonNode r : q.path("reponses")) {
                    QuestionOption option = new QuestionOption();
                    option.setValeurReponse(r.path("valeurReponse").asText());
                    option.setEstCorrecte(r.path("estCorrecte").asBoolean());
                    option.setFeedback(r.path("feedBack").asText(""));
                    options.add(option);
                }
                question.setOptions(options);
                questions.add(question);
            }

            quiz.setQuestions(questions);

            Long professeurId = professeurRepository.findById(SecurityUtil.getAuthenticatedUserId()).get().getId();
            System.err.println("Quiz: " + quiz.toString());
            return createQuiz(quiz, professeurId);
//            return null;
        } catch (Exception e) {
            throw new RuntimeException("Erreur de parsing Gemini JSON : " + e.getMessage(), e);
        }
    }

    public List<Object[]> getQuizSummariesByProfesseur(Long professeurId) {
        List<Quiz> quizzes = quizRepository.findByCreateurId(professeurId);
        List<Object[]> summaries = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd"); // Sans l'heure

        for (Quiz quiz : quizzes) {
            String dateCreation = quiz.getDateCreation() != null
                    ? dateFormat.format(quiz.getDateCreation())
                    : null;

            Object[] summary = new Object[]{
                    quiz.getId(),
                    quiz.getTitre(),
                    quiz.getDescription(),
                    quiz.getQuestions() != null ? quiz.getQuestions().size() : 0,
                    dateCreation,
                    quiz.isEstPublic(),
                    quiz.getDuree()
            };
            summaries.add(summary);
        }

        return summaries;
    }

    public Quiz updateQuizWithQuestionsPartially(Long quizId, Quiz updatedQuiz) {
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz avec ID " + quizId + " introuvable."));

        // Mise à jour des champs simples
        existingQuiz.setTitre(updatedQuiz.getTitre());
        existingQuiz.setDescription(updatedQuiz.getDescription());
        existingQuiz.setDuree(updatedQuiz.getDuree());
        existingQuiz.setEstPublic(updatedQuiz.isEstPublic());
        existingQuiz.setCorrectionImmediate(updatedQuiz.isCorrectionImmediate());
        existingQuiz.setDatePublication(updatedQuiz.getDatePublication());

        // Mise à jour intelligente des questions
        List<Question> existingQuestions = existingQuiz.getQuestions();
        List<Question> updatedQuestions = updatedQuiz.getQuestions();

        // Supprimer les questions retirées
        existingQuestions.removeIf(existingQ ->
                updatedQuestions.stream().noneMatch(updatedQ -> updatedQ.getId() != null && updatedQ.getId().equals(existingQ.getId()))
        );

        for (Question updatedQ : updatedQuestions) {
            if (updatedQ.getId() == null) {
                // Nouvelle question
                updatedQ.setQuiz(existingQuiz);
                if (updatedQ.getOptions() != null) {
                    for (QuestionOption option : updatedQ.getOptions()) {
                        option.setQuestion(updatedQ);
                    }
                }
                existingQuestions.add(updatedQ);
            } else {
                // Mise à jour d’une question existante
                for (Question existingQ : existingQuestions) {
                    if (existingQ.getId().equals(updatedQ.getId())) {
                        existingQ.setEnonce(updatedQ.getEnonce());
                        existingQ.setPoints(updatedQ.getPoints());
                        existingQ.setType(updatedQ.getType());

                        // Mise à jour intelligente des options
                        List<QuestionOption> existingOptions = existingQ.getOptions();
                        List<QuestionOption> updatedOptions = updatedQ.getOptions();

                        // Supprimer les options retirées
                        existingOptions.removeIf(existingOpt ->
                                updatedOptions.stream().noneMatch(updatedOpt ->
                                        updatedOpt.getId() != null && updatedOpt.getId().equals(existingOpt.getId())
                                )
                        );

                        // Ajouter ou mettre à jour les options
                        for (QuestionOption updatedOpt : updatedOptions) {
                            if (updatedOpt.getId() == null) {
                                updatedOpt.setQuestion(existingQ);
                                existingOptions.add(updatedOpt);
                            } else {
                                for (QuestionOption existingOpt : existingOptions) {
                                    if (existingOpt.getId().equals(updatedOpt.getId())) {
                                        existingOpt.setValeurReponse(updatedOpt.getValeurReponse());
                                        existingOpt.setEstCorrecte(updatedOpt.isEstCorrecte());
                                        existingOpt.setFeedback(updatedOpt.getFeedback());
                                        break;
                                    }
                                }
                            }
                        }

                        break;
                    }
                }
            }
        }

        return quizRepository.save(existingQuiz);
    }

}
