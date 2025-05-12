# Plateforme de Quiz IA - QGen

## Description du projet

Cette plateforme web permet la génération et la gestion de quiz pédagogiques automatisés par intelligence artificielle. Elle aide les enseignants à créer rapidement des évaluations interactives tout en offrant aux étudiants une expérience utilisateur simple et fluide.

### Fonctionnalités principales

- **Génération automatique de quiz par IA (Gemini AI)**
  - Analyse de contenus textuels ou PDF
  - Création de questions variées (QCU, vrai/faux, QCM)
  - Personnalisation des questions générées

- **Gestion des quiz**
  - Création manuelle ou assistée par IA
  - Édition et publication des quiz
  - Paramétrage du temps imparti

- **Interface étudiants**
  - Accès aux quiz disponibles
  - Passage des évaluations
  - Consultation des résultats

- **Suivi pédagogique**
  - Statistiques de performance en temps réel
  - Analyse individuelle ou globale
  - Export des résultats au format PDF

## Architecture technique

La plateforme est composée de deux parties principales :

- **Backend** : Spring Boot (architecture MVC)
  - Gestion des utilisateurs
  - Gestion des quiz et réponses
  - Logique métier
  - API REST

- **Frontend** : React
  - Interface utilisateur
  - Organisation en composants, services, pages, utils
  - Design personnalisé en CSS
  - Communication avec le backend via Axios

## Installation et lancement

### Prérequis

- Java JDK (pour le backend)
- Node.js et npm (pour le frontend)
- Un navigateur web moderne

### Lancement du backend

```bash
# Accéder au répertoire backend
cd backend

# Lancer le serveur Spring Boot
./mvnw spring-boot:run
```

### Lancement du frontend

```bash
# Installer les dépendances
npm install

# Installer Axios pour les appels API
npm install axios

# Démarrer l'application React
npm start
```

L'interface web s'ouvre automatiquement dans votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000).

## Utilisation

1. Connectez-vous en tant qu'enseignant ou étudiant
2. Pour les enseignants :
   - Créez un nouveau quiz manuellement ou via l'IA
   - Importez un document pour la génération automatique
   - Modifiez les questions proposées si nécessaire
   - Publiez le quiz pour le rendre accessible
   - Consultez et exportez les résultats

3. Pour les étudiants :
   - Accédez aux quiz disponibles
   - Passez les évaluations dans le temps imparti
   - Consultez vos résultats

## Contribution

Pour contribuer au projet, veuillez suivre les bonnes pratiques de développement et soumettre vos modifications via des pull requests.

