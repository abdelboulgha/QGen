package com.example.backend.dao;

import com.example.backend.beans.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUtilisateurId(Long utilisateurId);
    List<Notification> findByUtilisateurIdAndEstLue(Long utilisateurId, boolean estLue);
}
