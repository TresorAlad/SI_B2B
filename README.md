**B2B — Application fullstack (Frontend React + Backend Spring Boot)**

Résumé
-
Ce dépôt contient une application web B2B avec :

- un frontend React + Vite (dossier racine du projet)
- un backend Spring Boot (dossier `backend/`) exposant une API et une configuration Maven

Objectif
-
Prototype de marketplace B2B pour la gestion et la consultation de produits.

Prérequis
-
- Node.js (>=18) et npm
- Java 17+ (ou la version spécifiée dans le `pom.xml`)
- Maven (optionnel si vous utilisez le wrapper `mvnw`)
- Docker & Docker Compose (pour lancer la base Postgres définie dans `backend/compose.yaml`)

Installation et démarrage
-

Frontend (développement)

1. Installer les dépendances depuis la racine du projet :

```bash
npm install
```

2. Lancer le serveur de développement Vite :

```bash
npm run dev
```

Frontend (production)

```bash
npm run build
npm run preview
```

Backend (développement)

1. Se placer dans le dossier backend et lancer l'application avec le wrapper Maven :

```bash
cd backend
./mvnw spring-boot:run
```

2. (Optionnel) Utiliser Docker Compose pour la base de données Postgres :

```bash
cd backend
docker compose -f compose.yaml up -d
```

Tests
-
Backend :

```bash
cd backend
./mvnw test
```

Structure du projet
-
- backend/: source Java Spring Boot, fichier `compose.yaml`, et `pom.xml`
- src/: code frontend React (components, pages, layouts, etc.)
- public/: fichiers statiques

Notes et ressources
-
- Le backend contient un guide d'aide dans `backend/HELP.md` pour la configuration avancée, conteneurs natifs et builds.
- Vérifiez les versions et les variables d'environnement (base de données, ports) avant de déployer.

Contribuer
-
Les contributions sont bienvenues — ouvrez une issue ou une PR en expliquant la fonctionnalité ou le correctif.

Licence
-
Indiquez la licence souhaitée pour ce projet (ex: MIT). Si vous n'avez pas de licence, ajoutez-en une pour clarifier l'utilisation.

Contact
-
Pour toute question, contactez l'auteur ou ouvrez une issue dans le dépôt.
