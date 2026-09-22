# 🔐 Mise à Jour de Sécurité - MedievalKingdom Bot

## 🚨 Résumé des Changements

Cette mise à jour corrige les vulnérabilités de sécurité critiques identifiées dans le projet:

| Vulnérabilité                 | Statut     | Action                     |
| ----------------------------- | ---------- | -------------------------- |
| Token Discord exposé en dur   | ✅ Corrigé | Utilise `.env`             |
| Clé Stripe en dur             | ✅ Corrigé | Utilise `.env`             |
| Email PayPal exposé           | ✅ Corrigé | Utilise `.env`             |
| Pas de validation des entrées | ✅ Corrigé | `utils/security.js` ajouté |
| Pas de rate limiting          | ✅ Corrigé | express-rate-limit ajouté  |
| Pas de .gitignore             | ✅ Corrigé | `.gitignore` créé          |

---

## 📦 Fichiers Modifiés/Créés

### Créés:

- ✅ `.env.example` - Template des variables d'environnement
- ✅ `.gitignore` - Ignore les fichiers sensibles
- ✅ `utils/security.js` - Fonctions de validation et sécurité
- ✅ `docs/SECURITY_GUIDE.md` - Guide complet de sécurité
- ✅ `setup-security.sh` - Script d'installation (Linux/Mac)
- ✅ `setup-security.bat` - Script d'installation (Windows)

### Modifiés:

- ✅ `config.js` - Charge depuis `.env` avec validation
- ✅ `stripe_server.js` - Utilise `.env`, ajoute rate limiting et validation
- ✅ `commands/buygems.js` - Charge depuis `.env`, ajoute validation email
- ✅ `index.js` - Charge `dotenv` au démarrage
- ✅ `package.json` - Ajoute `dotenv` et `express-rate-limit`

---

## 🚀 Installation Rapide

### Option 1: Script Automatique (Windows)

```powershell
.\setup-security.bat
```

### Option 2: Script Automatique (Linux/Mac)

```bash
chmod +x setup-security.sh
./setup-security.sh
```

### Option 3: Manuel

1. **Créez le fichier `.env`:**

   ```bash
   copy .env.example .env
   # ou sur Windows: Copiez .env.example et renommez-le en .env
   ```

2. **Installez les dépendances:**

   ```bash
   npm install
   ```

3. **Configurez les secrets dans `.env`:**

   ```env
   DISCORD_TOKEN=votre_token_ici
   CLIENT_ID=votre_client_id
   GUILD_ID=votre_guild_id
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   PAYPAL_EMAIL=votre@email.com
   NODE_ENV=production
   PORT=4242
   ```

4. **Lancez le bot:**
   ```bash
   node index.js
   ```

---

## ⚠️ ACTIONS REQUISES IMMÉDIATEMENT

### 1. Régénérez le Token Discord

Le token suivant était exposé publiquement:

```
MTM5MTc4NTA3MDA0MTIzOTU2Mg.GeevYH.LGLw8rD6Fwt1c-Dqf_nBmYzs-8Ej2K0MCMyZqM
```

**Étapes:**

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application
3. Cliquez sur "Bot" dans le menu de gauche
4. Cliquez sur "Regenerate" à côté du TOKEN
5. Copiez le nouveau token
6. Collez-le dans votre fichier `.env` (`DISCORD_TOKEN=`)

### 2. Régénérez la Clé Stripe

```bash
# Allez sur https://dashboard.stripe.com/apikeys
# Générez une nouvelle clé secrète (Secret Key)
# Mettez à jour STRIPE_SECRET_KEY dans .env
```

### 3. Configurez le Webhook Stripe

```bash
# Allez sur https://dashboard.stripe.com/webhooks
# Créez un nouveau webhook pointant vers: https://votredomaine.com/webhook
# Copiez le secret et mettez-le dans STRIPE_WEBHOOK_SECRET
```

### 4. Vérifiez .gitignore

```bash
# Confirmez que .env est ignoré
git status
# .env ne doit PAS être listé
```

---

## 🧪 Tests à Effectuer

- [ ] Le bot démarre sans erreurs
- [ ] Les commandes Discord fonctionnent
- [ ] Le webhook Stripe fonctionne
- [ ] Les paiements PayPal fonctionnent
- [ ] Aucun secret n'est affiché dans les logs

---

## 📚 Documentation

Pour plus de détails, consultez:

- 📖 [SECURITY_GUIDE.md](docs/SECURITY_GUIDE.md) - Guide complet de sécurité
- 📖 `.env.example` - Template des variables d'environnement

---

## 🔍 Vérification de Sécurité

Pour vérifier qu'aucun secret n'est commité:

```bash
# Vérifier les secrets en staging
git diff --cached | grep -i "token\|secret\|key\|password"

# Vérifier les secrets modifiés
git diff | grep -i "token\|secret\|key\|password"

# Vérifier l'historique (danger!)
git log --all --grep="token\|secret" --oneline
```

---

## ❓ Questions/Problèmes?

### Le bot ne démarre pas?

```
❌ Error: DISCORD_TOKEN manquant
```

**Solution:** Vérifiez que `.env` existe et contient `DISCORD_TOKEN=...`

### Les webhooks Stripe ne fonctionnent pas?

```
❌ Error: Webhook signature verification failed
```

**Solution:** Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct

### Où trouver mes tokens?

- **Discord Token:** https://discord.com/developers/applications → Bot → TOKEN
- **Stripe Keys:** https://dashboard.stripe.com/apikeys
- **Webhook Secret:** https://dashboard.stripe.com/webhooks

---

## ✨ Bonnes Pratiques à Partir de Maintenant

1. **Jamais commiter `.env`** - Le `.gitignore` le bloque
2. **Valider TOUTES les entrées** - Utilisez les fonctions de `utils/security.js`
3. **Utiliser HTTPS partout** - Pour les webhooks et URLs externes
4. **Auditer les permissions** - Vérifier que seuls les admins ont accès aux commandes sensibles
5. **Monitorer les logs** - Rechercher les erreurs d'authentification

---

## 📈 Prochaines Améliorations

- [ ] Chiffrer les données sensibles en base
- [ ] Ajouter un système de 2FA pour les admins
- [ ] Implémenter une rotation des tokens
- [ ] Ajouter des tests de sécurité automatisés
- [ ] Auditer régulièrement les dépendances avec `npm audit`

---

**Date:** Février 2026  
**Version:** 1.0 - Mise à jour de sécurité
