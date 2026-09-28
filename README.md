# Portfolio de Marie Nicaise Makamgue Djembong

Site vitrine en React, avec une administration et une base PostgreSQL. Les textes viennent du CV et du site HTML d'origine.

## Lancer le site

PostgreSQL tourne dans Docker, sur le port **5433** (le port 5432 est déjà pris par un autre projet).

```bash
docker compose up -d
npm run install:all
npm run dev
```

- Site : http://127.0.0.1:5173
- API : http://127.0.0.1:4000

## Administration

Adresse : http://127.0.0.1:5173/admin

Identifiants créés au premier démarrage :

- e-mail : `admin@ungestedivin.org`
- mot de passe : `MamaCoco2026`

Le mot de passe se change dans **Administration → Mot de passe**.

Depuis l'administration on peut :

- réécrire chaque page (titre, introduction, citation, paragraphes)
- afficher ou masquer une page dans le menu
- ajouter, modifier, réordonner et supprimer les chiffres, expertises, pays, actions, reconnaissances et partenaires
- envoyer des photos depuis l'ordinateur (accueil, portrait, galerie)
- lire, marquer et supprimer les messages du formulaire de contact

## Déploiement sur Railway

1. Créez un projet Railway et ajoutez le plugin **PostgreSQL**.
2. Nouveau service depuis ce dépôt GitHub. Railway lit `railway.toml`.
3. Variables du service web :

- `DATABASE_URL` : la variable du plugin Postgres (référence `${{Postgres.DATABASE_URL}}`)
- `JWT_SECRET` : une longue clé secrète
- `ADMIN_EMAIL` : l'adresse de connexion
- `ADMIN_PASSWORD` : le mot de passe du premier démarrage (la base est vide, le compte est créé à ce moment)
- `DATABASE_SSL` : `true` seulement si l'URL Postgres est publique (`rlwy.net`)
- `UPLOAD_DIR` : `/data/uploads` si vous montez un volume sur `/data` (les photos de l'administration survivent aux redéploiements)

Le site et l'API sont servis par le même service, sur le port fourni par Railway.

## Fichiers d'origine

- `CV_Marie_Nicaise_MakamgueDjembong.pdf (2).pdf`
- `site.html`
