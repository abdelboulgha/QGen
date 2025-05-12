package com.example.backend.controller;

import com.example.backend.beans.QuestionOption;
import com.example.backend.service.QuestionOptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/question-options")
public class QuestionOptionController {

    @Autowired
    private QuestionOptionService questionOptionService;

    @GetMapping
    public List<QuestionOption> getAllQuestionOptions() {
        return questionOptionService.getAllQuestionOptions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionOption> getQuestionOptionById(@PathVariable Long id) {
        Optional<QuestionOption> questionOption = questionOptionService.getQuestionOptionById(id);
        return questionOption.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/question/{questionId}")
    public List<QuestionOption> getQuestionOptionsByQuestionId(@PathVariable Long questionId) {
        return questionOptionService.getQuestionOptionsByQuestionId(questionId);
    }

    @PostMapping("/question/{questionId}")
    public QuestionOption createQuestionOption(@RequestBody QuestionOption questionOption, @PathVariable Long questionId) {
        return questionOptionService.createQuestionOption(questionOption, questionId);
    }

    @PutMapping
    public QuestionOption updateQuestionOption(@RequestBody QuestionOption questionOption) {
        return questionOptionService.updateQuestionOption(questionOption);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestionOption(@PathVariable Long id) {
        questionOptionService.deleteQuestionOption(id);
        return ResponseEntity.noContent().build();
    }
}