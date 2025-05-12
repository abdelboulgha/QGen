package com.example.backend.service;

import com.example.backend.beans.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class GeminiAIService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();
    private final ProfesseurService professeurService;

    @Autowired
    public GeminiAIService(ProfesseurService professeurService) {
        this.professeurService = professeurService;
    }


    public Quiz generateQuizFromPDFContent(String pdfContent) throws IOException {
        try {
            String prompt = buildPromptForQuizGenerationFromPdf(pdfContent);
            String response = callGeminiAPI(prompt);
            return parseGeminiResponse(response);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du quiz avec Gemini AI: " + e.getMessage(), e);
        }
    }

    public Quiz generateQuizFromText(String text) throws IOException {
        try {
            String prompt = buildPromptForQuizGenerationFromText(text);
            String response = callGeminiAPI(prompt);
            return parseGeminiResponse(response);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du quiz avec Gemini AI: " + e.getMessage(), e);
        }
    }

    private String buildPromptForQuizGenerationFromPdf(String pdfContent) {
        return "You are an expert quiz creator. Your task is to analyze the following document and generate a quiz in French with exactly **20 questions**. " +
                "Each question must be a QCU (question à choix unique), meaning it has exactly 4 possible answers and only one of them is correct.\n\n" +
                "Output only a valid JSON object in this exact structure, written in French:\n\n" +
                "{\n" +
                "  \"titre\": \"Titre du quiz généré\",\n" +
                "  \"description\": \"Brève description du quiz\",\n" +
                "  \"duree\": \"Durée approximative en minutes\",\n" +
                "  \"questions\": [\n" +
                "    {\n" +
                "      \"enonce\": \"Texte de la question\",\n" +
                "      \"points\": \"Nombre de points pour cette question\",\n" +
                "      \"type\": \"qcu\",\n" +
                "      \"reponses\": [\n" +
                "        {\n" +
                "          \"valeurReponse\": \"Texte de la réponse\",\n" +
                "          \"estCorrecte\": true ou false,\n" +
                "          \"feedBack\": \"Explication ou justification\"\n" +
                "        },\n" +
                "        {...} // total de 4\n" +
                "      ]\n" +
                "    },\n" +
                "    {...}\n" +
                "  ]\n" +
                "}\n\n" +

                "Rules:\n" +
                "1. The quiz and all text must be in French.\n" +
                "2. Each question must have exactly 4 response options.\n" +
                "3. Only one of the 4 responses must have 'estCorrecte': true.\n" +
                "4. Each response must include a clear 'FeedBack' in French.\n" +
                "5. The final output must be only a valid JSON structure, without any extra explanation or comments.\n\n" +

                "Here is the document content to analyze:\n\n" + pdfContent;
    }
    private String buildPromptForQuizGenerationFromText(String text) {
    return "You are an expert quiz creator. Based on the following topic or description provided by the user, generate a quiz in **French** with exactly **20 questions**." +
            " Each question must be a **QCU (question à choix unique)**, meaning it has exactly **4 answer options**, and only **one correct** answer.\n\n" +

            "Respond only with a valid JSON object in the following exact structure:\n\n" +

            "{\n" +
            "  \"titre\": \"Title of the generated quiz\",\n" +
            "  \"description\": \"Brief description of the quiz\",\n" +
            "  \"duree\": \"Approximate duration in minutes\",\n" +
            "  \"questions\": [\n" +
            "    {\n" +
            "      \"enonce\": \"Question text\",\n" +
            "      \"points\": \"Number of points for this question\",\n" +
            "      \"type\": \"qcu\",\n" +
            "      \"reponses\": [\n" +
            "        {\n" +
            "          \"valeurReponse\": \"Answer text\",\n" +
            "          \"estCorrecte\": true or false,\n" +
            "          \"feedBack\": \"Explanation or justification in French\"\n" +
            "        },\n" +
            "        {...} // total of 4 options\n" +
            "      ]\n" +
            "    },\n" +
            "    {...}\n" +
            "  ]\n" +
            "}\n\n" +

            "Rules:\n" +
            "1. The entire quiz and all text must be written in **French**.\n" +
            "2. Each question must have **exactly 4 answer options**.\n" +
            "3. Only one of the four responses must have 'estCorrecte': true.\n" +
            "4. Each answer option must include a clear 'feedBack' in French.\n" +
            "5. The final output must be a valid JSON structure only — do not include any explanations, comments, or extra text.\n\n" +

            "Here is the user input topic or description to base the quiz on:\n\n" + text;
}


    private String callGeminiAPI(String prompt) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        ObjectNode requestBody = objectMapper.createObjectNode();

        ArrayNode contents = objectMapper.createArrayNode();
        ObjectNode content = objectMapper.createObjectNode();
        ArrayNode parts = objectMapper.createArrayNode();

        ObjectNode textPart = objectMapper.createObjectNode();
        textPart.put("text", prompt);
        parts.add(textPart);

        content.set("parts", parts);
        contents.add(content);
        requestBody.set("contents", contents);

        ObjectNode generationConfig = objectMapper.createObjectNode();
        generationConfig.put("temperature", 0.2);
        generationConfig.put("maxOutputTokens", 8192);
        generationConfig.put("topP", 0.95);
        requestBody.set("generationConfig", generationConfig);

        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
        String responseJson = restTemplate.postForObject(apiUrl, request, String.class);

        return extractTextFromGeminiResponse(responseJson);
    }

    private String extractTextFromGeminiResponse(String responseJson) throws IOException {
        JsonNode root = objectMapper.readTree(responseJson);
        return root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
    }


    private Quiz parseGeminiResponse(String response) {
        String jsonPart = extractJsonFromResponse(response);
        try {
            JsonNode root = objectMapper.readTree(jsonPart);

            Quiz quiz = new Quiz();
            quiz.setTitre(root.path("titre").asText(""));
            quiz.setDescription(root.path("description").asText(""));
            quiz.setDuree(root.path("duree").asInt(15));
//            quiz.setCreateur(professeurService.getProfesseurById(SecurityUtil.getAuthenticatedUserId()).get());
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
            return quiz;
        } catch (Exception e) {
            throw new RuntimeException("Erreur de parsing Gemini JSON : " + e.getMessage(), e);
        }
    }


    private String extractJsonFromResponse(String response) {
        int startIndex = response.indexOf('{');
        int endIndex = response.lastIndexOf('}') + 1;

        if (startIndex >= 0 && endIndex > startIndex) {
            return response.substring(startIndex, endIndex);
        }

        throw new IllegalArgumentException("Impossible de trouver un objet JSON dans la réponse");
    }
}