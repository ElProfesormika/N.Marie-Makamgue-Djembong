# Marie Nicaise Makamgue Djembong

Site de Marie Nicaise Makamgue Djembong, alias Mama Coco. Coach business, coach en confiance en soi et coach matrimoniale. Fondatrice-présidente de l'AISBL « Un Geste Divin », à Charleroi.

Le site public est en français et en anglais. Une icône de langue, dans la barre du site et dans l'administration, ouvre le choix : Français ou English.

Site en ligne : [marie-makamgue-djembong.up.railway.app](https://marie-makamgue-djembong.up.railway.app)

Contact : [Mariemakamgue@gmail.com](mailto:Mariemakamgue@gmail.com)

## Lancer en local

PostgreSQL tourne dans Docker, sur le port 5433.

```bash
docker compose up -d
npm run install:all
npm run dev
```

- Site : http://127.0.0.1:5173
- API : http://127.0.0.1:4000

Copiez `.env.example` vers `.env` et remplissez les variables avant le premier démarrage. Le fichier `.env` ne se commit pas.

## Administration

Adresse locale : http://127.0.0.1:5173/admin

Le compte est créé au premier démarrage, à partir de `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans `.env`. Ces identifiants ne sont pas écrits dans ce fichier. Le mot de passe se change ensuite dans Administration, page Mot de passe.

Depuis l'administration on peut :

- réécrire chaque page
- afficher ou masquer une page dans le menu
- ajouter, modifier, réordonner et supprimer les listes (pays, actions, reconnaissances, partenaires)
- envoyer des photos
- lire et supprimer les messages du formulaire
- passer l'interface en français ou en anglais

Les textes enregistrés restent la version française. L'anglais du site public est la traduction de cette version.

## Déploiement

Le site et l'API sont servis par le même service. Railway lit `railway.toml`.

Variables du service web, sans les écrire ici :

- `DATABASE_URL`, référence du plugin PostgreSQL
- `JWT_SECRET`, une longue clé secrète
- `ADMIN_EMAIL` et `ADMIN_PASSWORD`, utilisés seulement si la base est vide
- `DATABASE_SSL`, à `true` seulement pour une URL Postgres publique
- `UPLOAD_DIR`, par exemple `/data/uploads` si un volume est monté sur `/data`

Le port est celui fourni par la plateforme.
