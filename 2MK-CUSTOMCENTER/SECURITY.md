# 🔐 Configuration Sécurité - 2MK Custom Center

## Variables Sensibles

Les fichiers de configuration contenant des informations sensibles (mots de passe, clés API, etc.) ne doivent **JAMAIS** être committés sur GitHub.

### Fichiers à Configurer Localement

1. **`src/environments/environment.ts`** (développement)
   - Contient les identifiants EmailJS
   - Contient le mot de passe du dashboard administrateur

2. **`src/environments/environment.prod.ts`** (production)
   - Identifiants de production
   - Mot de passe sécurisé en production

### 📋 Setup Initial

1. **Dupliquer le fichier d'exemple:**
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```

2. **Remplir les valeurs réelles dans `environment.ts`:**
   ```typescript
   export const environment = {
     production: false,
     emailJsServiceId: 'votre_service_id',
     emailJsTemplateId: 'votre_template_id', 
     emailJsPublicKey: 'votre_clé_publique',
     dashboardPassword: 'votre_mot_de_passe_sécurisé'
   };
   ```

3. **Faire la même chose pour `environment.prod.ts`**

### 🛡️ Bonnes Pratiques

- ✅ **À FAIRE:**
  - Utiliser des mots de passe forts (min 12 caractères)
  - Mettre à jour les mots de passe régulièrement
  - Utiliser des variables d'environnement en production
  - Vérifier `.gitignore` pour s'assurer que `environment.ts` est ignoré

- ❌ **À ÉVITER:**
  - Ne jamais committer `environment.ts` ou `environment.prod.ts`
  - Ne pas partager les mots de passe par email
  - Ne pas utiliser les mêmes identifiants dev/prod

### 🔒 Dashboard Administrateur

**Mot de passe par défaut:** Édité dans `src/environments/environment.ts`

**Accès au dashboard:**
- URL: `/admin` ou `/dashboard`
- Limite: 3 tentatives avant verrouillage 5 minutes
- Dure: 1 heure d'inactivité

### 📚 Ressources

- EmailJS: https://www.emailjs.com/
- Angular Environment Configuration: https://angular.io/guide/build#environment-configuration

---

**Dernière mise à jour:** 04/04/2026
