# Instructions Copilot pour My Monster

## Architecture et Principes

Ce projet suit les principes de Clean Architecture et Clean Code :

### Structure du Projet
- `src/core` : Logique métier pure (entities, use cases)
- `src/infrastructure` : Implémentations techniques (API, repositories)
- `src/presentation` : Components UI et logique de présentation
- `src/components` : Components réutilisables

### Principes à Suivre
1. **SOLID**
   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

2. **Clean Code**
   - DRY (Don't Repeat Yourself)
   - KISS (Keep It Simple, Stupid)
   - Nommage explicite des variables/fonctions
   - Fonctions courtes et monofonctionnelles

3. **Composants**
   - Privilégier les composants fonctionnels
   - Utiliser des custom hooks pour la logique réutilisable
   - Props typées avec TypeScript
   - Composition over inheritance

4. **État et Gestion des Données**
   - Utiliser les hooks React appropriés
   - Séparation claire entre logique métier et présentation

## Style Guide
- Utiliser TailwindCSS pour le styling
- Suivre une palette de couleurs cohérente
- Composants responsive et accessibles
- Mobile-first approach

## Features en Cours
- Page d'accueil avec sections :
  - Hero section avec CTA d'inscription
  - Présentation des bénéfices
  - Galerie de monstres
  - Actions possibles
  - Newsletter avec promotion
  - Header de navigation
  - Footer légal

## Workflows
1. Toujours commencer par les interfaces/types
2. Implémenter la logique métier pure
3. Créer les composants UI
4. Connecter la logique aux composants
5. Tester et valider

## Notes de Maintenance
- Mettre à jour ce fichier lors de l'ajout de nouvelles fonctionnalités
- Documenter les changements majeurs d'architecture
- Maintenir la cohérence du style et de l'architecture
