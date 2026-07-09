# Business is Business — Site web

Site vitrine du jeu de société **Business is Business** : 4 pages (Accueil, Règles, Tournois, F.A.Q), bilingue FR/EN, entièrement animé.

## ▶️ Voir le site (aucune installation)

1. Décompressez le dossier.
2. Double-cliquez sur **`index.html`** — le site s'ouvre dans votre navigateur.
3. Naviguez avec le menu de gauche.

> Une connexion internet est nécessaire au premier chargement (polices + moteur de style Tailwind chargés en ligne).

## 📁 Contenu

```
bib-site-v2/
├── index.html        ← Accueil (vidéo, pions, plateau, étapes, témoignages…)
├── regles.html       ← Les 9 règles du jeu
├── tournois.html     ← Coming soon + compte à rebours + inscription
├── faq.html          ← Questions/réponses filtrables
├── css/style.css     ← Toutes les animations
├── js/
│   ├── i18n.js       ← Textes FR + EN (modifiez ici pour changer le contenu)
│   └── shared.js     ← Menu, pied de page, newsletter, pop-ups…
└── assets/
    ├── img/          ← Images (logo, pions, plateau, illustrations, avatars…)
    ├── video/        ← Vidéos (accueil + bande clients)
    └── icons/        ← Icônes (âge, durée, joueurs, menu)
```

## ✨ Ce qui est interactif / animé

- **Vidéo d'accueil** en arrière-plan derrière le logo.
- **Bande vidéo « clients »** dans la section mécaniques.
- **Apparition au défilement** de chaque section + titres animés.
- **Carrousel** automatique dans « Maîtrisez les règles ».
- **Pop-up** au clic sur Achetez / Négociez / Dominez.
- **Timeline** qui se dessine dans « Le rythme d'une ascension ».
- **Accordéon + filtres** par catégorie dans la F.A.Q.
- **Compte à rebours en direct** sur la page Tournois.
- **Survols** animés partout (cartes, images, boutons).
- **Bouton FR / EN** en bas du menu : traduit tout le site.

## ✏️ Modifier les textes

Tout le texte vit dans **`js/i18n.js`**, en deux blocs `fr:` et `en:`.
Cherchez la clé (ex. `'concept.text'`) et changez la valeur. Les questions de la F.A.Q sont dans `FAQ_DATA`.

---

## 🚀 Mettre en ligne via GitHub (gratuit)

### Étape 1 — Créer le dépôt
1. Allez sur https://github.com → bouton **New** (nouveau dépôt).
2. Nom : `business-is-business` → **Create repository**.

### Étape 2 — Envoyer les fichiers
1. Sur la page du dépôt vide : lien **« uploading an existing file »**.
2. Glissez-déposez **tout le contenu** du dossier `bib-site-v2` (pas le dossier lui-même — les fichiers `index.html`, `css/`, `js/`, `assets/`…).
3. Cliquez **Commit changes**.

### Étape 3 — Activer le site
1. Onglet **Settings** du dépôt → menu **Pages**.
2. Sous *Source*, choisissez la branche **main** / dossier **/(root)** → **Save**.
3. Patientez ~1 min : GitHub affiche l'adresse publique de votre site
   (`https://VOTRE-NOM.github.io/business-is-business/`).

C'est en ligne. 🎉

> Ensuite, si vous voulez peaufiner le design visuellement, vous pouvez importer ce même dépôt GitHub dans **Claude Design**.
