# Projet Habita Plus Exam 


<img width="1536" height="1024" alt="ChatGPT Image 25 août 2025, 21_19_05" src="https://github.com/user-attachments/assets/621096e3-c1ab-418b-9d6c-590682a20426" />

Ce projet est une application web full-stack développée comme examen technique pour Habita Plus dans le cadre de notre cours d'ingénieurie logiciel. 
Elle démontre l'authentification des utilisateurs, l'inscription et l'accès à des données protégées en utilisant des technologies modernes. L'application inclut un frontend construit avec Next.js pour l'interface utilisateur et un backend avec NestJS gérant la logique API via tRPC. Prisma est utilisé pour les interactions avec la base de données, et JWT pour une authentification sécurisée.

## Fonctionnalités

- **Inscription Utilisateur** : Création d'un nouveau compte avec email, mot de passe, nom et âge optionnel.
- **Connexion Utilisateur** : Authentification des utilisateurs et réception d'un token JWT stocké en localStorage (frontend) pour la gestion de session.
- **Routes Protégées** : Affichage d'une liste d'utilisateurs uniquement lorsque authentifié.
- **Déconnexion** : Suppression du token d'authentification et redirection vers la connexion.
- **Mises à Jour en Temps Réel** : Le frontend se met à jour automatiquement avec les changements en utilisant React Query et tRPC.
- **Gestion des Erreurs** : Traitement gracieux des erreurs d'authentification, des identifiants invalides et des accès non autorisés.

## Stack Technique

- **Frontend** : Next.js (framework React), tRPC (pour des appels API type-safes), Tailwind CSS (styles avec thèmes light/dark), React Query (récupération de données), Shadcn UI (composants UI comme Button).
- **Backend** : NestJS (framework Node.js), tRPC (endpoints API), Prisma (ORM pour la base de données), bcrypt (hachage de mots de passe), JWT (authentification).
- **Base de Données** : MySQL (configurée via Prisma ; suppose une configuration Docker pour le développement local).
- **Autres Outils** : Docker Compose (pour le conteneur de base de données MySQL), ESLint/Prettier (qualité du code), Git (contrôle de version), Concurrently (pour exécuter plusieurs commandes en parallèle).

## Prérequis

- Node.js (v18 ou supérieur)
- npm (ou yarn/pnpm/bun)
- Docker (pour exécuter la base de données MySQL via Docker Compose)
- Une base de données MySQL (locale ou hébergée dans le cloud)

## Installation

1. **Cloner le Repository** :
   ```
   git clone https://github.com/nakir00/habita-plus-exam.git
   cd habita-plus-exam
   ```

2. **Installer les Dépendances et Construire les Paquets Partagés** :
   Exécutez cette commande à la racine du projet pour installer toutes les dépendances et construire les paquets partagés :
   ```
   npm run install:all
   ```

3. **Configurer les Variables d'Environnement** :
   - Dans `apps/server`, créez un fichier `.env` avec le contenu suivant :
     ```
     DATABASE_URL="mysql://user:password@localhost:3306/habitadb"
     JWT_SECRET="your-secret-key"  # Remplacez par une clé secrète sécurisée
     NODE_ENV=development
     PORT=5000
     ```
   - Ajustez `DATABASE_URL` en fonction de votre configuration MySQL (par exemple, si vous utilisez Docker Compose, assurez-vous que les identifiants correspondent à ceux définis dans `docker-compose.yml`).

4. **Configurer la Base de Données** :
   - Si vous utilisez Docker, démarrez le conteneur MySQL défini dans `apps/server/docker-compose.yml` :
     ```
     cd apps/server
     docker-compose up -d
     ```
     Cela lancera un conteneur MySQL accessible sur `localhost:3306` avec les identifiants par défaut (vérifiez `docker-compose.yml` pour les détails spécifiques, comme user/root et password).
   - Une fois la base de données en cours d'exécution, exécutez les commandes Prisma depuis la racine du projet :
     ```
     npm run db:generate  # Génère le client Prisma
     npm run db:push  # Pousse le schéma vers la base de données (sans migration)
     ```
     - Pour créer et appliquer une migration en développement :
       ```
       npm run db:migrate
       ```
     - Pour ouvrir Prisma Studio (interface graphique pour explorer la base de données) :
       ```
       npm run db:studio
       ```
     - Autres commandes utiles pour la base de données :
       - `npm run db:reset` : Réinitialise la base de données.
       - `npm run db:seed` : Exécute les seeds (si définis).
       - `npm run db:pull` : Tire le schéma de la base de données.
       - `npm run db:format` : Formate le fichier schema.prisma.
       - `npm run db:validate` : Valide le fichier schema.prisma.
       - `npm run db:dev` : Génère, pousse et ouvre Prisma Studio.
       - `npm run db:fresh` : Réinitialise, génère et pousse.

## Exécution de l'Application

Le projet utilise un monorepo avec des workspaces (`apps/*` et `packages/*`). Des scripts NPM sont définis à la racine pour faciliter le développement et le build.

1. **Démarrer en Mode Développement** :
   Exécutez cette commande à la racine pour démarrer le backend et le frontend en parallèle (avec rechargement automatique) :
   ```
   npm run dev
   ```
   - Le backend s'exécutera sur `http://localhost:5000` (endpoint tRPC : `http://localhost:5000/trpc`).
   - Le frontend s'exécutera sur `http://localhost:3000`.

2. **Démarrer Séparément** (si nécessaire) :
   - Backend seul : `npm run dev:backend`.
   - Frontend seul : `npm run dev:frontend`.

3. **Accéder à l'Application** :
   - Accueil : `http://localhost:3000/` (affiche un message de bienvenue et la liste des utilisateurs protégée si connecté).
   - Connexion : `http://localhost:3000/login`.
   - Inscription : `http://localhost:3000/register`.

## Utilisation

- **Inscrire un Utilisateur** : Allez sur `/register`, remplissez le formulaire et soumettez. Vous recevrez un token JWT.
- **Se Connecter** : Allez sur `/login`, entrez les identifiants. En cas de succès, le token est stocké en localStorage, et vous pouvez accéder aux fonctionnalités protégées.
- **Afficher les Utilisateurs** : Sur la page d'accueil, les utilisateurs authentifiés voient une liste de tous les utilisateurs inscrits.
- **Se Déconnecter** : Cliquez sur le bouton de déconnexion (apparaît lorsque authentifié) pour supprimer le token.

## Endpoints API (via tRPC)

Toutes les interactions API sont gérées via tRPC sur `/trpc`. Procédures clés :

- `auth.register` : Mutation pour la création d'utilisateur.
- `auth.login` : Mutation pour l'authentification (retourne JWT).
- `protected.users` : Query pour récupérer la liste des utilisateurs (requiert auth).
- `hello` : Query publique pour tester.

Utilisez des outils comme Postman ou le playground tRPC (si activé) pour tester.

## Tests

- **Tests Backend** :
  ```
  cd apps/server
  npm run test  # Tests unitaires
  npm run test:e2e  # Tests end-to-end
  ```

- **Frontend** : Pas de tests spécifiques fournis, mais vous pouvez ajouter Jest/React Testing Library si nécessaire.

## Build

Pour construire l'application :
```
npm run build
```
- Cela construit les paquets partagés, le backend et le frontend.

## Déploiement

- **Frontend** : Déployez sur Vercel (recommandé pour Next.js). Consultez le README du frontend pour plus de détails.
- **Backend** : Déployez sur une plateforme comme Heroku, AWS ou Render. Utilisez des variables d'environnement pour les secrets.
- **Base de Données** : Utilisez un service géré MySQL comme PlanetScale ou AWS RDS.
- Pour la production, assurez-vous que `NODE_ENV=production` et sécurisez votre secret JWT.
- Pour le déploiement avec Docker, vous pouvez utiliser `docker-compose.yml` comme base pour orchestrer la base de données en production, mais adaptez-le pour inclure le backend si nécessaire.

## Contributions

Les contributions sont les bienvenues ! Forkez le repo, créez une branche et soumettez une pull request. Assurez-vous que le code suit les règles ESLint/Prettier.

<img width="100" height="100" alt="ChatGPT Image 25 août 2025, 21_19_01" src="https://github.com/user-attachments/assets/c4e4f622-3f00-469a-b821-dffa77942aa7" />

## Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.

## Encadreur
[madame NGOM](mailto:fifisokhna@gmail.com)

## Membres de groupes

- Mamodou BARRY
- Omar DIOUF
- Mustapha MBAYE
- Mouhamed Naby MBAYE
- Papa Malick NDIAYE


## Remerciements

- Construit avec [Next.js](https://nextjs.org), [NestJS](https://nestjs.com), [tRPC](https://trpc.io) et [Prisma](https://prisma.io).
- Polices : Geist de Vercel.

Pour tout problème, ouvrez une issue sur GitHub ou contactez le mainteneur.
