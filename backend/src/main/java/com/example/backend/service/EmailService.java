package com.example.backend.service;

import com.example.backend.beans.Utilisateur;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Si vous souhaitez utiliser Thymeleaf pour des templates d'emails
    // Si non, vous pouvez supprimer cette injection et la méthode associée
    @Autowired(required = false)
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username:noreply@example.com}")
    private String fromEmail;

    /**
     * Envoie un email simple avec les identifiants de connexion
     * @param utilisateur l'utilisateur destinataire
     * @param role le rôle de l'utilisateur
     * @throws MessagingException si l'envoi échoue
     */
    public void sendCredentialsEmail(Utilisateur utilisateur, String role) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(utilisateur.getEmail());
        helper.setSubject("Vos identifiants de connexion");

        String emailContent = buildCredentialsEmailContent(utilisateur, role);
        helper.setText(emailContent, true); // true pour le format HTML

        mailSender.send(message);
    }

    /**
     * Construit le contenu de l'email avec les identifiants
     * @param utilisateur l'utilisateur destinataire
     * @param role le rôle de l'utilisateur
     * @return le contenu HTML de l'email
     */
    private String buildCredentialsEmailContent(Utilisateur utilisateur, String role) {
        // Si vous avez injecté Thymeleaf, vous pouvez utiliser cette méthode à la place
        // return buildEmailFromTemplate(utilisateur, role);

        StringBuilder builder = new StringBuilder();
        builder.append("<html><body>");
        builder.append("<h2>Bienvenue sur notre plateforme QGen!</h2>");
        builder.append("<p>Bonjour ").append(utilisateur.getPrenom()).append(" ").append(utilisateur.getNom()).append(",</p>");
        builder.append("<p>Votre compte ").append(role.toLowerCase()).append(" a été créé avec succès.</p>");
        builder.append("<p>Voici vos identifiants de connexion :</p>");
        builder.append("<ul>");
        builder.append("<li><strong>Email:</strong> ").append(utilisateur.getEmail()).append("</li>");
        builder.append("<li><strong>Mot de passe:</strong> ").append(utilisateur.getMotDePasse()).append("</li>");
        builder.append("</ul>");
        builder.append("<p>Nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>");
        builder.append("<p>Cordialement,<br/>L'équipe administrative</p>");
        builder.append("</body></html>");

        return builder.toString();
    }

    /**
     * Version alternative utilisant Thymeleaf (optionnel)
     * Nécessite la configuration d'un template Thymeleaf
     */
    private String buildEmailFromTemplate(Utilisateur utilisateur, String role) {
        if (templateEngine == null) {
            // Fallback si Thymeleaf n'est pas configuré
            return buildCredentialsEmailContent(utilisateur, role);
        }

        Context context = new Context();
        context.setVariable("utilisateur", utilisateur);
        context.setVariable("role", role);

        return templateEngine.process("emails/credentials", context);
    }
}