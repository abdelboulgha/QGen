package com.example.backend.service;

import com.example.backend.beans.*;
import com.example.backend.dao.ProfesseurRepository;
import com.example.backend.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class QuizGenerationService {

    private final PDFService pdfService;
    private final GeminiAIService geminiAIService;
    private final QuizService quizService;
    private final QuestionService questionService;
    private final ProfesseurRepository professeurRepository;
    private final QuestionOptionService questionOptionService;

    @Autowired
    public QuizGenerationService(PDFService pdfService,
                                 GeminiAIService geminiAIService,
                                 QuizService quizService,
                                 QuestionService questionService,
                                 ProfesseurRepository professeurRepository,
                                 QuestionOptionService questionOptionService) {
        this.pdfService = pdfService;
        this.geminiAIService = geminiAIService;
        this.quizService = quizService;
        this.questionService = questionService;
        this.professeurRepository = professeurRepository;
        this.questionOptionService = questionOptionService;
    }

    /**
     * Génère un quiz à partir d'un fichier PDF
     *
     * @param pdfFile             Le fichier PDF à analyser
     * @return Une réponse contenant le quiz généré ou un message d'erreur
     */
//    public QuizGenerationResponse generateQuizFromPDF(
//            MultipartFile pdfFile,
//            String titre,
//            String description,
//            int duree,
//            boolean estPublic,
//            boolean correctionImmediate,
//            int nombreQuestions,
//            Long professeurId) {
//
//        try {
//            // 1. Extraire le texte du PDF
//            String pdfContent = pdfService.extractTextFromPDF(pdfFile);
//
//            // 2. Vérifier si le contenu du PDF est suffisant
//            if (pdfContent == null || pdfContent.trim().isEmpty() || pdfContent.length() < 100) {
//                return new QuizGenerationResponse(null,
//                        "Le contenu du PDF est insuffisant pour générer un quiz.", false);
//            }
//
//            // 3. Vérifier si le professeur existe
//            Optional<Professeur> professeurOpt = professeurRepository.findById(professeurId);
//            if (!professeurOpt.isPresent()) {
//                return new QuizGenerationResponse(null,
//                        "Professeur non trouvé avec l'ID: " + professeurId, false);
//            }
//
//            // 4. Créer le quiz
//            Quiz quiz = new Quiz();
//            quiz.setTitre(titre);
//            quiz.setDescription(description);
//            quiz.setDuree(duree);
//            quiz.setEstPublic(estPublic);
//            quiz.setCorrectionImmediate(correctionImmediate);
//            quiz.setDateCreation(new Date());
//            quiz.setCreateur(professeurOpt.get());
//
//            // 5. Vérifier la taille du contenu PDF pour limiter la requête à Gemini
//            // Si le contenu est trop volumineux, nous prenons juste les premiers 15000 caractères
//            // pour éviter de surcharger l'API ou de dépasser les limites
//            String trimmedContent = pdfContent;
//            if (pdfContent.length() > 15000) {
//                trimmedContent = pdfContent.substring(0, 15000);
//            }
//
//            // 6. Générer les questions avec l'API Gemini
//            Quiz generatedQuestions = geminiAIService.generateQuizFromPDFContent(trimmedContent);
//
//            // 7. Sauvegarder le quiz
//            Quiz savedQuiz = quizService.createQuiz(quiz, professeurId);
//
//            // 7. Associer les questions au quiz et les sauvegarder
//            for (Question question : generatedQuestions.getQuestions()) {
//                Question savedQuestion = questionService.createQuestion(question, savedQuiz.getId());
//            }
//
//            // 8. Retourner la réponse
//            return new QuizGenerationResponse(
//                    savedQuiz,
//                    "Quiz généré avec succès à partir du PDF.",
//                    true);
//
//        } catch (IOException e) {
//            return new QuizGenerationResponse(
//                    null,
//                    "Erreur lors du traitement du fichier PDF: " + e.getMessage(),
//                    false);
//        } catch (Exception e) {
//            return new QuizGenerationResponse(
//                    null,
//                    "Erreur lors de la génération du quiz: " + e.getMessage(),
//                    false);
//        }
//    }

    public QuizGenerationResponse generateQuizFromPDF(MultipartFile pdfFile) {
        try {
            String pdfContent = pdfService.extractTextFromPDF(pdfFile);

            if (pdfContent == null || pdfContent.trim().isEmpty() || pdfContent.length() < 100) {
                return new QuizGenerationResponse(null,
                        "Le contenu du PDF est insuffisant pour générer un quiz.", false);
            }

            String trimmedContent = pdfContent.length() > 15000 ? pdfContent.substring(0, 15000) : pdfContent;

            Quiz generatedQuiz = geminiAIService.generateQuizFromPDFContent(trimmedContent);

            Long professeurId = professeurRepository.findById(SecurityUtil.getAuthenticatedUserId()).get().getId();

            Quiz savedQuiz = quizService.createQuiz(generatedQuiz, professeurId);

            for (Question question : generatedQuiz.getQuestions()) {
                Question savedQuestion = questionService.createQuestion(question, savedQuiz.getId());
                for (QuestionOption option : question.getOptions()) {
                    questionOptionService.createQuestionOption(option, savedQuestion.getId());
                }
            }

            return new QuizGenerationResponse(generatedQuiz,
                    "Quiz généré avec succès (sans sauvegarde en base).", true);

        } catch (IOException e) {
            return new QuizGenerationResponse(null,
                    "Erreur lors du traitement du fichier PDF: " + e.getMessage(), false);
        } catch (Exception e) {
            return new QuizGenerationResponse(null,
                    "Erreur lors de la génération du quiz: " + e.getMessage(), false);
        }
    }

    /**
     * Génère un quiz à partir d'un Text
     *
     * @param text           Le Text à analyser
     * @return Une réponse contenant le quiz généré ou un message d'erreur
     */
    public QuizGenerationResponse generateQuizFromText(String text) {
        try {
            if (text == null) {
                return new QuizGenerationResponse(null,
                        "Aucun contenu générer un quiz.", false);
            }
            Quiz generatedQuiz = geminiAIService.generateQuizFromText(text);

            Long professeurId = professeurRepository.findById(SecurityUtil.getAuthenticatedUserId()).get().getId();

            Quiz savedQuiz = quizService.createQuiz(generatedQuiz, professeurId);

            for (Question question : generatedQuiz.getQuestions()) {
                Question savedQuestion = questionService.createQuestion(question, savedQuiz.getId());
                for (QuestionOption option : question.getOptions()) {
                    questionOptionService.createQuestionOption(option, savedQuestion.getId());
                }
            }

            return new QuizGenerationResponse(generatedQuiz,
                    "Quiz généré avec succès (sans sauvegarde en base).", true);

        } catch (IOException e) {
            return new QuizGenerationResponse(null,
                    "Erreur lors du traitement du fichier PDF: " + e.getMessage(), false);
        } catch (Exception e) {
            return new QuizGenerationResponse(null,
                    "Erreur lors de la génération du quiz: " + e.getMessage(), false);
        }
    }
}