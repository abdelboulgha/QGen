package com.example.backend.service;

import com.example.backend.beans.Question;
import com.example.backend.beans.QuestionOption;
import com.example.backend.dao.QuestionOptionRepository;
import com.example.backend.dao.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionOptionService {

    private final QuestionOptionRepository questionOptionRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionOptionService(QuestionOptionRepository questionOptionRepository, QuestionRepository questionRepository) {
        this.questionOptionRepository = questionOptionRepository;
        this.questionRepository = questionRepository;
    }

    public List<QuestionOption> getAllQuestionOptions() {
        return questionOptionRepository.findAll();
    }

    public Optional<QuestionOption> getQuestionOptionById(Long id) {
        return questionOptionRepository.findById(id);
    }

    public List<QuestionOption> getQuestionOptionsByQuestionId(Long questionId) {
        return questionOptionRepository.findByQuestionId(questionId);
    }

    public QuestionOption createQuestionOption(QuestionOption questionOption, Long questionId) {
        Optional<Question> question = questionRepository.findById(questionId);
        if (question.isPresent()) {
            questionOption.setQuestion(question.get());
            return questionOptionRepository.save(questionOption);
        }
        return null;
    }

    public QuestionOption updateQuestionOption(QuestionOption questionOption) {
        return questionOptionRepository.save(questionOption);
    }

    public void deleteQuestionOption(Long id) {
        questionOptionRepository.deleteById(id);
    }
}