# Catalogue TechZone Bénin

Catalogue en ligne (téléphones, ordinateurs, tablettes, accessoires) avec commande directe
sur WhatsApp. Next.js 16 + PostgreSQL (Supabase) + Drizzle ORM, déployé sur Netlify.

## Ce qui a changé par rapport au site d'origine

- Panier, checkout, paiement en ligne, suivi de commande, avis clients, newsletter et
  tableau de bord des ventes ont été retirés : ce n'est plus une boutique en ligne, c'est
  un catalogue. Chaque produit a un bouton **Commander sur WhatsApp** qui ouvre WhatsApp
  avec le message prérempli `Bonjour Techzone Bénin je suis intéressé par "<nom du produit>"`.
- Les 106 produits du fichier catalogue fourni ont été importés (`src/data/catalogue.json`),
  répartis dans 4 familles (Téléphones, Ordinateurs, Tablettes, Audio & Accessoires) avec
  des sous-catégories fines pour les filtres.
- Tant qu'aucune vraie photo n'a été envoyée, chaque produit affiche un visuel générique
  par catégorie (pas de vraies photos produit inventées).
- Un espace admin (`/admin`, protégé par mot de passe) permet d'ajouter un produit
  (nom + prix + photo + notes) et de générer sa description avec l'IA (Gemini), dans le
  style du fichier catalogue d'origine.
- Design entièrement refait dans un style **verre dépoli (glassmorphism)**, inspiré du
  langage visuel « Liquid Glass » d'iOS 26/27.

## 1. Installer les dépendances

```bash
npm install
```

## 2. Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com), ouvrez votre projet existant (celui déjà lié à
   votre compte) ou créez-en un.
2. **Base de données** — `Project Settings > Database > Connection string`, onglet
   **Transaction pooler** (port `6543`). C'est cette chaîne-là qu'il faut utiliser, pas la
   connexion directe (port `5432`) : Netlify exécute le site en fonctions serverless, qui
   ouvrent beaucoup de connexions courtes — sans le pooler, la base sature vite et le site
   plante de façon intermittente.
3. **Storage** (photos envoyées depuis l'admin) — `Storage > New bucket`, nommez-le
   `product-images`, cochez **Public bucket** (pour que les photos s'affichent sur le site
   sans configuration supplémentaire).
4. **Clé service_role** — `Project Settings > API` → copiez la clé `service_role`
   (⚠️ secrète, jamais exposée au navigateur, sert uniquement dans les routes serveur).

## 3. Configurer les variables d'environnement

Copiez `.env.example` vers `.env` et remplissez chaque valeur (voir les commentaires dans
le fichier). Vous aurez besoin de :

- `DATABASE_URL` (pooler Supabase, étape 2)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (étape 2)
- `GEMINI_API_KEY` — créez une clé gratuite sur [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- `ADMIN_PASSWORD` — le mot de passe pour accéder à `/admin`
- `ADMIN_SESSION_SECRET` — une chaîne aléatoire longue, générée une seule fois :
  ```bash
  openssl rand -hex 32
  ```

## 4. Créer les tables et importer le catalogue

**Avec Node.js (sur un ordinateur) :**
```bash
npm run db:push    # crée la table "products" sur Supabase à partir du schéma
npm run db:seed    # importe les 106 produits du fichier catalogue
```

**Sans ordinateur, depuis un simple navigateur (téléphone compris) :** ouvrez
`Supabase Dashboard > SQL Editor > New query`, collez le contenu de
`sql/001_schema.sql`, cliquez sur *Run* — puis faites la même chose avec
`sql/002_seed.sql`. Ces deux fichiers font exactement la même chose que les
commandes `npm run db:push` / `npm run db:seed` ci-dessus, sans rien installer.
`sql/002_seed.sql` peut être recollé sans risque (les doublons sont ignorés).

## 5. Tester en local

```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000). L'admin est sur
`/admin` (mot de passe = `ADMIN_PASSWORD`).

## 6. Déployer sur Netlify

1. Poussez ce projet sur un dépôt Git (GitHub/GitLab), puis connectez-le à Netlify.
2. Netlify détecte automatiquement Next.js (`netlify.toml` inclus). Build command :
   `npm run build`.
3. Dans **Site settings > Environment variables**, ajoutez exactement les mêmes variables
   que dans votre `.env` (`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `GEMINI_API_KEY`, `GEMINI_MODEL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`).
4. Déployez. Vérifiez `https://votre-site.netlify.app/api/health` : `{"status":"ok"}`
   confirme que la base répond.

## Gérer le catalogue au quotidien

Allez sur `/admin`, entrez le mot de passe. Pour ajouter un produit : renseignez nom, prix,
catégorie, état, éventuellement des notes techniques (RAM, stockage, écran…), ajoutez une
ou plusieurs photos, puis cliquez sur **Générer avec l'IA** pour la description — vous
pouvez toujours la corriger à la main avant d'enregistrer.

### Sécurité de l'admin — ce qu'il faut savoir

- Le mot de passe protège la page, **et** chaque appel aux routes qui créent/modifient des
  produits (`/api/admin/*`) est vérifié indépendamment côté serveur (`src/middleware.ts`).
  Sans ça, quelqu'un aurait pu appeler l'API directement (par exemple depuis les outils
  développeur du navigateur) sans jamais voir la page de connexion.
- La clé Gemini et la clé Supabase `service_role` ne sont utilisées que dans des routes
  serveur — elles ne se retrouvent jamais dans le code envoyé au navigateur.
- Le message « dissuasif » sur l'écran de connexion est purement cosmétique : c'est la
  vérification ci-dessus qui protège réellement le site, pas le texte.
- Changez `ADMIN_PASSWORD` si vous soupçonnez qu'il a fuité ; pensez aussi à régénérer
  `ADMIN_SESSION_SECRET` pour invalider toutes les sessions en cours.

## Notes sur les données importées

- Le fichier catalogue contenait deux tablettes (Samsung Tab A11, Redmi Pad 2) classées
  par erreur sous « Enceintes & audio » — elles ont été reclassées dans « Tablettes ».
- Le modèle Gemini par défaut (`GEMINI_MODEL`) peut devenir obsolète avec le temps ; la
  liste des modèles disponibles se trouve sur [Google AI Studio](https://aistudio.google.com).
