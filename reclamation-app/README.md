# Système de Gestion des Réclamations

Application web de gestion des réclamations clients développée avec Spring Boot et Angular.

## Technologies

- **Back-end** : Spring Boot 3.2, Spring Data JPA, Spring Validation, MySQL, Swagger/OpenAPI
- **Front-end** : Angular 17 (Standalone Components), Bootstrap 5
- **Déploiement** : Docker, Docker Compose

## Entités
comen
- `Client` : id, nom, email, téléphone
- `AgentSAV` : id, nom, compétence
- `Reclamation` : id, client, produit, statut, description, date, note, agentSAV
- `SuiviReclamation` : id, message, réclamation, agent, action, date

## Fonctionnalités

- CRUD complet sur toutes les entités
- Enregistrement et suivi des réclamations clients
- Affectation des réclamations aux agents SAV
- Historique de suivi par réclamation
- Rapport de satisfaction client (note moyenne, taux de résolution, répartition par statut)

## Lancement avec Docker

```bash
cd reclamation-app
docker-compose up --build
```

- Front-end : http://localhost:4200
- Back-end API : http://localhost:8080/api
- Swagger UI : http://localhost:8080/swagger-ui.html

## Lancement en développement

### Back-end
```bash
cd backend
mvn spring-boot:run
```

### Front-end
```bash
cd frontend
npm install
ng serve
```

> Assurez-vous d'avoir MySQL en local sur le port 3306 avec la base `reclamation_db`.
