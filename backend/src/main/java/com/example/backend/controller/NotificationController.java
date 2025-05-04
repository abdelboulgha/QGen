package com.example.backend.controller;

import com.example.backend.beans.Notification;
import com.example.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/utilisateur/{utilisateurId}")
    public List<Notification> getNotificationsByUtilisateur(@PathVariable Long utilisateurId) {
        return notificationService.getNotificationsByUtilisateur(utilisateurId);
    }

    @GetMapping("/utilisateur/{utilisateurId}/non-lues")
    public List<Notification> getNotificationsNonLuesByUtilisateur(@PathVariable Long utilisateurId) {
        return notificationService.getNotificationsNonLuesByUtilisateur(utilisateurId);
    }

    @PostMapping
    public Notification createNotification(@RequestParam String message, @RequestParam Long utilisateurId) {
        return notificationService.creerNotification(message, utilisateurId);
    }

    @PutMapping("/{id}/marquer-lue")
    public ResponseEntity<Notification> marquerNotificationCommeLue(@PathVariable Long id) {
        Notification notification = notificationService.marquerCommeLue(id);
        return notification != null ? ResponseEntity.ok(notification) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
