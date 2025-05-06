package com.example.backend.service;

import com.example.backend.beans.Notification;
import com.example.backend.beans.Utilisateur;
import com.example.backend.dao.NotificationRepository;
import com.example.backend.dao.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
                               UtilisateurRepository utilisateurRepository) {
        this.notificationRepository = notificationRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getNotificationsByUtilisateur(Long utilisateurId) {
        return notificationRepository.findByUtilisateurId(utilisateurId);
    }

    public List<Notification> getNotificationsNonLuesByUtilisateur(Long utilisateurId) {
        return notificationRepository.findByUtilisateurIdAndEstLue(utilisateurId, false);
    }

    public Notification creerNotification(String message, Long utilisateurId) {
        Optional<Utilisateur> utilisateur = utilisateurRepository.findById(utilisateurId);
        if (utilisateur.isPresent()) {
            Notification notification = new Notification();
            notification.setMessage(message);
            notification.setUtilisateur(utilisateur.get());
            notification.setDateCreation(new Date());
            notification.setEstLue(false);

            return notificationRepository.save(notification);
        }
        return null;
    }

    public Notification marquerCommeLue(Long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notification.setEstLue(true);
            return notificationRepository.save(notification);
        }
        return null;
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
