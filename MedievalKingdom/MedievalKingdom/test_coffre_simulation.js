/**
 * Script de simulation pour tester les coffres d'enchantement
 * Simule l'ouverture de coffres et affiche les statistiques
 */

const enchantmentsData = require("./database/enchantments.json");
const goldShopData = require("./database/goldShop.json");

// Fonction identique à celle dans goldshop.js
function getRandomEnchantment(lootTable, enchantmentsData) {
  if (!enchantmentsData || !enchantmentsData.enchantments) return null;

  // Déterminer la rareté
  const rand = Math.random();
  let cumulativeChance = 0;
  let selectedRarity = null;

  for (const [rarity, chance] of Object.entries(lootTable)) {
    cumulativeChance += chance;
    if (rand <= cumulativeChance) {
      selectedRarity = rarity;
      break;
    }
  }

  // Filtrer les enchantements par rareté
  const availableEnchantments = Object.entries(enchantmentsData.enchantments)
    .filter(([id, ench]) => ench.rarity === selectedRarity)
    .map(([id, ench]) => ({ id, ...ench }));

  if (availableEnchantments.length === 0) return null;

  // Sélectionner un enchantement aléatoire
  const selected =
    availableEnchantments[
      Math.floor(Math.random() * availableEnchantments.length)
    ];
  return selected;
}

// Simulation
console.log("🎮 SIMULATION D'OUVERTURE DE COFFRES D'ENCHANTEMENT\n");
console.log("=".repeat(60));

const chests = [
  { id: "coffre_enchantement_mineur", count: 100 },
  { id: "coffre_enchantement", count: 100 },
  { id: "coffre_enchantement_superieur", count: 100 },
  { id: "coffre_enchantement_legendaire", count: 100 },
];

chests.forEach(({ id, count }) => {
  const chest = goldShopData.magicChests[id];
  console.log(`\n📦 ${chest.name} (${count} ouvertures)`);
  console.log("-".repeat(60));

  const results = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    null: 0,
  };

  const enchantmentCounts = {};

  // Simuler l'ouverture
  for (let i = 0; i < count; i++) {
    const enchantment = getRandomEnchantment(chest.lootTable, enchantmentsData);
    if (enchantment) {
      results[enchantment.rarity]++;
      enchantmentCounts[enchantment.id] =
        (enchantmentCounts[enchantment.id] || 0) + 1;
    } else {
      results.null++;
    }
  }

  // Afficher les résultats
  console.log("\n📊 Distribution des raretés:");
  Object.entries(results).forEach(([rarity, count]) => {
    if (count > 0) {
      const percentage = ((count / 100) * 100).toFixed(1);
      const emoji = {
        common: "⚪",
        uncommon: "🟢",
        rare: "🔵",
        epic: "🟣",
        legendary: "🟡",
        null: "❌",
      }[rarity];
      console.log(
        `  ${emoji} ${rarity.padEnd(10)}: ${count
          .toString()
          .padStart(3)} (${percentage}%)`
      );
    }
  });

  // Afficher les enchantements les plus fréquents
  const topEnchantments = Object.entries(enchantmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topEnchantments.length > 0) {
    console.log("\n🏆 Top 5 enchantements obtenus:");
    topEnchantments.forEach(([id, count], index) => {
      const ench = enchantmentsData.enchantments[id];
      console.log(`  ${index + 1}. ${ench.emoji} ${ench.name}: ${count}x`);
    });
  }

  // Vérifier s'il y a eu des échecs
  if (results.null > 0) {
    console.log(
      `\n⚠️  ATTENTION: ${results.null} échecs (aucun enchantement obtenu) !`
    );
  } else {
    console.log(
      "\n✅ Aucun échec - Tous les coffres ont donné un enchantement !"
    );
  }
});

console.log("\n" + "=".repeat(60));
console.log("\n📋 RÉSUMÉ DES ENCHANTEMENTS DISPONIBLES\n");

const rarityEmojis = {
  common: "⚪",
  uncommon: "🟢",
  rare: "🔵",
  epic: "🟣",
  legendary: "🟡",
};

["common", "uncommon", "rare", "epic", "legendary"].forEach((rarity) => {
  const enchants = Object.entries(enchantmentsData.enchantments).filter(
    ([id, e]) => e.rarity === rarity
  );

  console.log(
    `${rarityEmojis[rarity]} ${rarity.toUpperCase()} (${enchants.length}):`
  );
  enchants.forEach(([id, e]) => {
    console.log(`  ${e.emoji} ${e.name} (${id})`);
  });
  console.log("");
});

console.log("=".repeat(60));
console.log("\n✅ Simulation terminée !\n");
