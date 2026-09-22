#!/usr/bin/env node

/**
 * Script de test et diagnostic pour la migration des quêtes
 * Utilisation: node test_quest_migration.js
 */

const { getAllPlayers } = require("./utils/database.js");
const {
  migrateQuestData,
  loadPlayers,
  savePlayersData,
} = require("./utils/database.js");

console.log("🧪 Diagnostic du Système de Quêtes");
console.log("=====================================\n");

// 1. Charger les joueurs
const players = getAllPlayers();
console.log(`📊 Nombre total de joueurs: ${players.length}\n`);

// 2. Analyser les quêtes actives
let playersWithQuests = 0;
let invalidQuests = 0;
let validQuests = 0;
let missingStartTime = 0;
let missingProgress = 0;

console.log("🔍 Analyse des quêtes actives:");
console.log("------------------------------");

for (const player of players) {
  if (player.quests && player.quests.active) {
    playersWithQuests++;
    const quest = player.quests.active;

    // Vérifier si c'est une quête valide
    const hasStartTime = !!quest.startTime;
    const hasProgress = quest.hasOwnProperty("progress");
    const hasTitle = !!quest.title;
    const hasDescription = !!quest.description;
    const hasDuration = !!quest.duration;

    const isValid = hasStartTime && hasTitle && hasDescription && hasDuration;

    if (isValid) {
      validQuests++;
      console.log(`✅ ${player.name}: Quête valide - "${quest.title}"`);
    } else {
      invalidQuests++;
      console.log(`❌ ${player.name}: Quête invalide`);

      if (!hasStartTime) {
        console.log(`   - ❌ Champ manquant: startTime`);
        missingStartTime++;
      }
      if (!hasProgress) {
        console.log(`   - ❌ Champ manquant: progress`);
        missingProgress++;
      }
      if (!hasTitle) {
        console.log(`   - ❌ Champ manquant: title`);
      }
      if (!hasDescription) {
        console.log(`   - ❌ Champ manquant: description`);
      }
      if (!hasDuration) {
        console.log(`   - ❌ Champ manquant: duration`);
      }

      // Afficher la structure de la quête actuelle
      console.log(`   Structure actuelle:`, JSON.stringify(quest, null, 2));
    }
  }
}

console.log(`\n📈 Résumé:`);
console.log(`- Joueurs avec quêtes actives: ${playersWithQuests}`);
console.log(`- Quêtes valides: ${validQuests} ✅`);
console.log(`- Quêtes invalides: ${invalidQuests} ❌`);
console.log(`  - Manquant startTime: ${missingStartTime}`);
console.log(`  - Manquant progress: ${missingProgress}`);

// 3. Proposer une migration
if (invalidQuests > 0) {
  console.log(`\n⚠️  Détecté ${invalidQuests} quête(s) invalide(s)!`);
  console.log(`💡 Suggéré: Lancer la migration`);
  console.log(`\n🔄 Lancement de la migration...\n`);

  const result = migrateQuestData();

  console.log(`✅ Migration complétée:`);
  console.log(`- Quêtes migrées: ${result.migratedCount}`);
  console.log(`- Quêtes abandonnées: ${result.abandonedCount}`);
} else if (playersWithQuests === 0) {
  console.log(`\n✅ Aucun joueur n'a de quête active - Système OK!`);
} else {
  console.log(`\n✅ Tous les joueurs avec des quêtes actives sont valides!`);
}

// 4. Vérifier la structure des joueurs sans quête active
console.log(`\n🏷️  Structure des quêtes (sample):`);
const playerWithoutQuest = players.find((p) => p.quests && !p.quests.active);
if (playerWithoutQuest) {
  console.log(`Exemple pour ${playerWithoutQuest.name}:`);
  console.log(JSON.stringify(playerWithoutQuest.quests, null, 2));
} else {
  console.log("Aucun joueur sans quête active trouvé");
}

console.log("\n✨ Diagnostic terminé!");
