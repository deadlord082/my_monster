# IMPLEMENTATION_NOTES

## Choix d'implémentations

J'ai décidé, par contrainte de temps, d'implémenter l'ensemble des fonctionnalités obligatoire + la connexion GOOGLE :

- Connexion via github
- Ajout des accéssoires & backgrounds
- Création du système de quêtes journalières
- Gallery des créatures publiques

### 1.1 Accessoires

* **Catalogue centralisé** : `src/config/accessory.config.ts`
* **3 catégories** : hats, glasses, shoes
* Un champ par catégorie sur chaque monstre
* Accessoires superposés visuellement sur le sprite du monstre (dashboard + détail)

Le système de rareté (bonus) n’a pas été implémenté.

### 1.2 Arrière-plans

* Catalogue dans `src/config/background.config.ts`
* Stockage de l’arrière-plan actif dans le modèle Monster
* Prévisualisation en boutique
* Application sur carte et détail
* Possibilités d'enlever l'arrière plan

### 1.3 Redirections et navigation

* `/sign-in` & `/sign-up` redirigent vers `/app`
* Routes protégées → redirection vers `/sign-in` si session absente

Mise en place via le middleware à la racine du projet

### 1.5 Design global

* Palette harmonisée
* Espacements cohérents
* Typographies unifiées
* Transitions fluides

### 1.6 Récompenses en Koins

* Gain immédiat
* Intégration directe avec le système de wallet

### 1.7 Extraction des configurations

Toutes les valeurs magiques ont été déplacées dans le dossier `src/config` :

* `accessories.config.ts` pour les accessoires
* `backgrounds.config.ts` pour les arrière-plans
* `quests.config.ts` pour les quêtes quotidiennes
*  ect ..

### 1.8 OAuth GitHub

* Intégration complète via Better Auth
* Bouton « Connexion avec GitHub »
* Redirections post-login fonctionnelles

### 1.9 Optimisations

* `useMemo` pour les calculs coûteux
* `useCallback` pour les fonctions passées en props
* Mise en cache de données statiques (ex : catalogue)
* Cron Vercel pour la mise à jour des quêtes

### 1.10 Galerie communautaire

* Champ `isPublic` ajouté
* Page `/app/gallery`
* Scroll infini
* Accessoires et arrière-plans intégrés

### 1.11 Quêtes journalières

* 3 quêtes uniques par jour
* Stockage dans collection dédiée
* Progression en temps réel
* Renouvellement via cron
* Interface avec progress bars et badges

---

## 2. Difficultés rencontrées

### 2.1 Superposition des accessoires

Ajustements nécessaires pour un rendu cohérent sur tous les écrans.

### 2.2 Redirections avec Better Auth

Quelques difficultés sur la création du middleware liées au manque de clarté de certains comportements de session.

### 2.3 Webhooks Stripe

Grosse difficulté à créer la webhooks et à la faire fonctionner

## 3. Optimisations appliquées

* Mémorisation des listes et filtres
* Décomposition en composants
* Lazy loading
* Déplacement des calculs dans des hooks
* Indexation MongoDB

---

## 4. Améliorations futures possibles

* Implémentation de la rareté des accessoires
* Ajout de Google OAuth
* Système d’achievements

---

## 5. Conclusion

Toutes les fonctionnalités obligatoires sont implémentées.
Le code reste évolutif et les bonus pourront être ajoutés sans refonte majeure.
