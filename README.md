# 🤖 Roboto — Trading Bot Automatisé sur Binance

Roboto est une application fullstack conçue pour **automatiser l’achat et la revente de cryptomonnaies** via l’API Binance.  
Elle s’appuie sur un algorithme décisionnel basé sur l’analyse de tendance et la volatilité du marché, et fournit un **dashboard synthwave élégant** pour suivre les performances en temps réel.

---

## 🚀 Fonctionnalités principales

- 🔄 **Synchronisation automatique avec Binance**
- 📊 **Analyse multi-critères** (variation journalière, hebdo, stagnation, BTC global…)
- 🤖 **Trigger algorithmique intelligent** (score par crypto, seuil d’achat/déclenchement)
- 💰 **Gestion du portefeuille** (USDC, cash, sécurité, pot actif/inactif)
- 🧠 **Tableau de bord visuel** en Next.js + Tailwind avec DA synthwave personnalisée
- 🔐 **Accès public/privé différencié** (bientôt avec IP-lock et contrôle manuel)

---

## 🧱 Stack technique

- **Next.js 14 (App Router)**
- **Prisma ORM** (SQLite pour dev, PostgreSQL possible)
- **TailwindCSS** + typographie `Orbitron` & `Manrope`
- **API Binance (REST)** via `axios`
- Composants modulaires (`CryptoGrid`, `WalletCard`, `BotStatusCard`, etc.)

---

## 📦 Lancer le projet en local

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

> Le projet sera disponible sur : [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet

```
/src
 ├── app                → Pages Next.js (app router)
 ├── components         → Composants UI réutilisables
 ├── lib                → Logique métier (sync, algorithme, update)
 ├── styles             → Fichiers CSS / Tailwind
 └── prisma             → Schéma de base de données + SQLite
```

---

## 🧠 Algorithme de trigger

Un score est attribué à chaque crypto selon des conditions de marché (prix, volume, tendance, comportement du BTC...).

> Un achat automatique est déclenché lorsque le score ≥ trigger

Exemples de conditions :

- 📉 Baisse sur 30j ou 7j : +1 à +2
- ⚖️ Stagnation : +1
- 🚀 Hausse brutale : -3
- ⚠️ BTC en surchauffe : -2 à -3

---

## 📈 Aperçu visuel

![Preview](https://github.com/user-attachments/assets/86a16f98-8511-4757-a5bc-00ab2f65a3f2)

---

## ✨ Auteur

Développé par **M.U.K**
