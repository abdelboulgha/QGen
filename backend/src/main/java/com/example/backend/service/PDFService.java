package com.example.backend.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class PDFService {

    private static final String UPLOAD_DIR = "uploads";

    public PDFService() {
        // Créer le répertoire d'upload s'il n'existe pas
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Impossible de créer le répertoire d'upload", e);
        }
    }

    /**
     * Convertit un fichier PDF en texte
     */
    public String extractTextFromPDF(MultipartFile file) throws IOException {
        // Vérifier si le fichier est un PDF
        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Le fichier doit être un PDF");
        }

        // Créer un fichier temporaire
        File pdfFile = convertMultipartFileToFile(file);

        try (PDDocument document = PDDocument.load(pdfFile)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            // Supprimer le fichier temporaire
            pdfFile.delete();

            return text;
        }
    }

    /**
     * Convertit un MultipartFile en File
     */
    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convertedFile = new File(UPLOAD_DIR + "/" + file.getOriginalFilename());

        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        }

        return convertedFile;
    }
}