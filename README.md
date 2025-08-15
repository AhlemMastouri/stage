# ✈️ Application Full Web - Gestion et Suivi des Anomalies d'Exploitation des Avions

## 📌 Description
Ce projet consiste en la conception et le développement d’une application **full web** permettant de gérer et de suivre les anomalies d’exploitation des avions.  
Une **anomalie d’exploitation** est identifiée par un type (code, description) et contient des informations telles que :
- La cause
- L’avion concerné
- Le vol concerné
- L’escale
- Les actions prises
- Les conséquences sur l’exploitation
- Les personnes/services à informer

---

## 🎯 Objectifs du projet
- Centraliser toutes les informations relatives aux anomalies.
- Normaliser la saisie des données.
- Améliorer la traçabilité des incidents.
- Automatiser la communication interne.
- Faciliter la prise de décision via des tableaux de bord.
- Réduire l’impact opérationnel des anomalies.
- Optimiser la coordination entre les services.

---

## 🛠️ Fonctionnalités prévues
- **Gestion des types d’anomalies** (code, description, catégorie).
- **Gestion des avions** (immatriculation, modèle, configuration, date de mise en service, statut).
- **Suivi des vols** et association des anomalies.
- **Gestion des escales**.
- **Suivi des actions prises** et des conséquences sur l’exploitation.
- **Module de reporting et statistiques**.
- **Interface responsive et intuitive**.

---

## 🗄️ Modélisation et Base de données
L’application repose sur une base de données structurée pour :
- Les **types d’anomalies**
- Les **avions**
- Les **vols**
- Les **escales**
- Les **services/personnes à informer**

*(Le schéma de base de données détaillé est disponible dans la documentation technique.)*

---

## 🛠️ Technologies utilisées
- **Frontend** : React.js / HTML / CSS / JavaScript
- **Backend** : Node.js / Express.js
- **Base de données** : MongoDB
- **Outils** : GraphQL, Postman, Apollo Server
- **Gestion de version** : Git & GitHub

---

## 🚀 Installation et exécution

### 1️⃣ Cloner le dépôt
```bash
git clone https://github.com/tonpseudo/nom-du-repo.git
2️⃣ Se déplacer dans le dossier
cd nom-du-repo

3️⃣ Installer les dépendances
npm install

4️⃣ Lancer le projet
npm start

