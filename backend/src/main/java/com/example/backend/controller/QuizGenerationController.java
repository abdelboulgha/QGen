package com.example.backend.controller;

import com.example.backend.beans.QuizGenerationResponse;
import com.example.backend.service.QuizGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Console;

@RestController
@RequestMapping("/api/generation")
public class QuizGenerationController {

    private final QuizGenerationService quizGenerationService;

    @Autowired
    public QuizGenerationController(QuizGenerationService quizGenerationService) {
        this.quizGenerationService = quizGenerationService;
    }
    /**
     * Endpoint pour générer un quiz à partir d'un PDF
     * @param pdfFile Le fichier PDF à analyser
     * @return La réponse contenant le quiz généré ou un message d'erreur
     */
    @PostMapping(value = "/quiz/pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<QuizGenerationResponse> generateQuizFromPDF(
            @RequestParam("file") MultipartFile pdfFile
            ) {
        QuizGenerationResponse response = quizGenerationService.generateQuizFromPDF(pdfFile);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }

    }

     /**
     * Endpoint pour générer un quiz à partir d'un Text
     * @param text Le Text à analyser
     * @return La réponse contenant le quiz généré ou un message d'erreur
     */

    @PostMapping(value = "/quiz/text")
    public ResponseEntity<QuizGenerationResponse> generateQuizFromPrompt(
            @RequestParam("text") String text
            ) {
        QuizGenerationResponse response = quizGenerationService.generateQuizFromText(text);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }

    }

}