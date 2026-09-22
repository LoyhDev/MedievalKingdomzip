# Changelog - MedievalKingdom Bot

## [v2.1.0] - Refonte du Système de Défense

### 🛡️ Système de Défense Revu

**CHANGEMENT MAJEUR** : Le système de défense a été complètement repensé pour être plus stratégique et équilibré.

#### Nouvelles Fonctionnalités

- **Limite d'utilisation** : 3 défenses maximum par combat

  - Compteur visible dans l'interface : `🛡️ Défenses: 3/3`
  - Message d'erreur clair si la limite est atteinte
  - Le compteur se met à jour en temps réel

- **Blocage complet des attaques** :

  - La défense bloque maintenant **100% des dégâts** (au lieu de 50%)
  - Fonctionne contre les attaques physiques ET magiques
  - Message spécifique : "🛡️ [Nom] bloque complètement l'attaque/le sort !"

- **Suppression de la régénération de mana** :
  - La défense ne régénère plus de mana
  - Équilibre le système avec le blocage complet

#### Améliorations de l'IA

- Les monstres utilisent la défense de manière plus stratégique
- Se défendent seulement quand vie < 25% (au lieu de 30%)
- Vérifient qu'il leur reste des défenses avant de les utiliser
- Probabilité réduite à 30% (au lieu de 40%)

#### Impact sur le Gameplay

- ✅ Plus stratégique : Les joueurs doivent choisir le bon moment
- ✅ Plus équilibré : Puissant mais limité
- ✅ Plus tactique : Garder ses défenses pour les moments critiques
- ✅ Plus clair : Interface améliorée avec compteur visible

#### Fichiers Modifiés

- `systems/combatSystem.js` : Logique de défense et blocage
- `commands/combat.js` : Affichage du compteur de défenses

#### Documentation

- `AMELIORATIONS_DEFENSE.md` : Documentation technique complète
- `GUIDE_DEFENSE.md` : Guide utilisateur avec exemples et stratégies

---

## [v2.0.0] - Dernières modifications

### ⚔️ Système de Combat

- **Sorts magiques améliorés** : Les attaques magiques infligent maintenant 50% de dégâts en plus
- **Défense magique réduite** : La défense magique est divisée par 3 au lieu de 2, permettant plus de dégâts
- **Effets spéciaux augmentés** :
  - Chance d'effet spécial passée de 20% à 25%
  - Bonus de dégâts des effets spéciaux augmenté de 20% à 30%
- **Protection anti-spam** : Le bot ne peut plus traiter deux actions de combat simultanées pour éviter les bugs

### 💎 Système de Gemmes en Vocal

- **Gain automatique** : Les joueurs gagnent 1 gemme par minute passée en vocal
- **Logs améliorés** : Le système affiche maintenant des logs détaillés dans la console
- **Changement de salon** : Le timer se réinitialise correctement lors du changement de salon vocal

### 📜 Système de Quêtes MJ (NOUVEAU)

Les joueurs avec le rôle MJ (ID: 1392254528899776582) peuvent maintenant créer des quêtes personnalisées !

#### Commandes disponibles :

- `/mjquete creer` - Créer une quête personnalisée
  - Titre, description, durée (5-300 minutes)
  - Récompenses personnalisables (XP et or)
  - Niveau minimum requis
- `/mjquete collective` - Créer une mission collective
  - Durée en heures (1-72h)
  - Nombre de participants (2-50)
  - Récompenses par participant
  - Système de recrutement et démarrage
- `/mjquete liste` - Voir toutes les quêtes MJ actives
- `/mjquete annuler` - Annuler une quête créée

#### Fonctionnalités :

- **Quêtes individuelles** : Les joueurs peuvent accepter les quêtes MJ comme des quêtes normales
- **Missions collectives** :
  - Plusieurs joueurs peuvent rejoindre la même mission
  - La mission démarre quand un participant ou le MJ lance le démarrage
  - Minimum 2 participants requis
  - Durée plus longue (en heures au lieu de minutes)
  - Récompenses automatiques à la fin pour tous les participants
- **Système de boutons** : Interface interactive pour accepter/rejoindre les quêtes
- **Notifications** : Annonces @everyone lors de la création de nouvelles quêtes

### 🛡️ Protection contre les combats simultanés

- **Vérification renforcée** : Un joueur ne peut plus avoir deux combats actifs en même temps
- **Flag de traitement** : Empêche le traitement de plusieurs actions simultanées
- **Messages d'erreur clairs** : Le joueur est informé s'il essaie de lancer un combat alors qu'il en a déjà un actif

## Configuration

### ID du rôle MJ

Le rôle MJ est configuré avec l'ID : `1392254528899776582`

Pour modifier cet ID, éditez le fichier `commands/mjquest.js` :

```javascript
const MJ_ROLE_ID = "VOTRE_ID_ICI";
```

### Taux de gemmes en vocal

Pour modifier le nombre de gemmes gagnées par minute en vocal, éditez `events/voiceStateUpdate.js` :

```javascript
const GEMMES_PER_MINUTE_VOCAL = 1; // Modifier cette valeur
```

## Notes techniques

### Fichiers modifiés :

1. `systems/combatSystem.js` - Amélioration des sorts magiques
2. `events/voiceStateUpdate.js` - Système de gemmes en vocal amélioré
3. `events/interactionCreate.js` - Gestion des quêtes MJ et protection anti-spam
4. `commands/mjquest.js` - NOUVEAU fichier pour les quêtes MJ

### Dépendances :

Aucune nouvelle dépendance requise. Toutes les fonctionnalités utilisent les modules existants.

### Compatibilité :

- Compatible avec la structure de base de données existante
- Les quêtes MJ utilisent le même système que les quêtes normales
- Pas de migration de données nécessaire

## Utilisation

### Pour les MJ :

1. Assurez-vous d'avoir le rôle MJ (ID: 1392254528899776582)
2. Utilisez `/mjquete creer` pour créer une quête simple
3. Utilisez `/mjquete collective` pour créer une mission de groupe
4. Les joueurs verront une annonce avec des boutons pour accepter/rejoindre

### Pour les joueurs :

1. Cliquez sur le bouton "✅ Accepter la quête" pour les quêtes individuelles
2. Cliquez sur "⚔️ Rejoindre la mission" pour les missions collectives
3. Utilisez `/quete active` pour voir votre progression
4. Utilisez `/quete terminer` une fois le temps écoulé

### Pour gagner des gemmes :

1. Rejoignez un salon vocal
2. Restez connecté (1 gemme par minute)
3. Les gemmes sont automatiquement ajoutées à votre compte en quittant le vocal

## Support

En cas de problème :

1. Vérifiez les logs de la console
2. Vérifiez que le bot a les permissions nécessaires
3. Vérifiez que l'ID du rôle MJ est correct
4. Redémarrez le bot si nécessaire
