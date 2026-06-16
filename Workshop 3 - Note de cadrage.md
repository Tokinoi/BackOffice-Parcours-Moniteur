# Note de cadrage — Projet Parcours Moniteur

## 1. Contexte

Le projet *Parcours Moniteur* vise à répondre au besoin d'une ECRS (enseignante de la conduite et de la sécurité routière) souhaitant disposer d'un outil permettant d'identifier rapidement des zones adaptées à l'apprentissage de la conduite.

Le besoin initial étant partiellement implicite, une phase de reformulation a été nécessaire afin de structurer les attentes et sécuriser la compréhension du projet avant le démarrage du développement.

## 2. Analyse de l'environnement

### Contexte métier

Le métier d'ECRS implique une organisation rigoureuse des séances de conduite. L'identification des zones d'apprentissage repose aujourd'hui sur l'expérience personnelle et la connaissance locale, ce qui pénalise les moniteurs en mobilité ou en début d'activité.

### Analyse du marché

Le secteur de l'enseignement de la conduite en France représente environ **13 000 auto-écoles** et plusieurs dizaines de milliers de moniteurs et d'ECRS. La préparation des séances repose aujourd'hui uniquement sur l'expérience personnelle et la connaissance locale, sans outil dédié.

Après vérification par le client, fort de son expérience terrain en auto-école, **aucune solution spécialisée n'existe sur ce marché**. Les outils disponibles ne répondent pas au besoin :

| Outil                       | Limite                                              |
| --------------------------- | --------------------------------------------------- |
| Google Maps / Waze          | Navigation générique, aucun critère pédagogique     |
| Outils internes auto-écoles | Inexistants ou limités à de la documentation papier |

Ce vide positionne Parcours Moniteur sur une **niche sans concurrent direct**, avec un potentiel d'adoption auprès de l'ensemble de la communauté des moniteurs français, voire européens à terme.

### Contexte économique et stratégique

Le projet s'inscrit dans une démarche entrepreneuriale portée par une future ECRS souhaitant créer un outil métier à forte valeur ajoutée. La stratégie commerciale envisagée repose sur un modèle freemium :

| Offre                    | Contenu                                                               |
| ------------------------ | --------------------------------------------------------------------- |
| Version gratuite         | Accès à la carte et consultation des points d'intérêt                 |
| Version payante          | Fonctionnalités avancées (itinéraires, groupes, filtres avancés)      |
| Comptes auto-école (B2B) | Partage de points d'intérêt au sein d'une structure, gestion d'équipe |

Ce modèle permet une adoption progressive : acquisition gratuite des moniteurs individuels, puis monétisation via les structures (auto-écoles). Le potentiel de croissance est renforcé par l'absence de solution concurrente et par la nature communautaire du produit (les données s'enrichissent avec le nombre d'utilisateurs).

### Environnement technique du commanditaire

Les moniteurs d'auto-école exercent en mobilité, sur des zones géographiques variées pouvant inclure des secteurs ruraux ou périphériques à faible couverture réseau. L'application est utilisée depuis un smartphone, en situation de conduite ou de préparation de séance.

| Dimension              | Détail                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Appareils**          | Android en priorité (cible principale), iOS en extension                                                                                   |
| **Connectivité**       | 4G en zones urbaines, couverture dégradée ou absente possible en zones périphériques                                                       |
| **Bande passante**     | Usage mobile standard ; les données cartographiques (tuiles OpenStreetMap) doivent pouvoir être mises en cache pour fonctionner hors ligne |
| **Mode offline**       | Requis pour l'usage métier                                                                                                                 |
| **Hébergement**        | Hébergement français ou européen — hébergeur à définir                                                                                     |
| **Niveau de sécurité** | Authentification passwordless + JWT, données de géolocalisation protégées (RGPD), aucun mot de passe stocké                                |

### Cadre réglementaire (RGPD)

L'application collecte et traite des données de géolocalisation d'utilisateurs. À ce titre, elle est soumise au Règlement Général sur la Protection des Données (RGPD) :

- recueil du consentement explicite de l'utilisateur à la collecte de sa position
- information claire sur l'usage des données
- droit à la suppression des données personnelles
- hébergement des données en France (contrainte validée par le client)
- aucun partage des données avec des tiers sans consentement

## 3. Enjeux stratégiques

### Premier entrant sur une niche non adressée

Le marché de l'enseignement de la conduite ne dispose d'aucun outil numérique dédié à l'identification des zones d'apprentissage. Parcours Moniteur se positionne en **premier entrant** sur ce segment, ce qui lui confère un avantage concurrentiel structurel : la base de données de points d'intérêt constituée par les premiers utilisateurs devient elle-même une barrière à l'entrée pour tout futur concurrent.

### Effet réseau et valeur croissante

La nature communautaire du produit crée un **effet réseau direct** : plus les moniteurs contribuent, plus la base de points d'intérêt s'enrichit, plus l'outil devient indispensable. Chaque utilisateur est à la fois consommateur et contributeur de valeur. Cet effet est d'autant plus fort que la donnée (les points d'intérêt) est difficilement reconstituable sans la communauté.

### Démarche entrepreneuriale à fort potentiel de scalabilité

Le projet ne se limite pas à un outil personnel. Il constitue la première brique d'un produit SaaS à destination de l'ensemble du secteur :

- **Court terme** : adoption individuelle par les moniteurs (freemium)
- **Moyen terme** : monétisation B2B via les auto-écoles (comptes structures)
- **Long terme** : extension géographique (marché européen) et élargissement des usages (trafic prédictif, automatisation des points d'intérêt)

### Amélioration de la qualité de l'enseignement #Bullshit?

Au-delà de l'enjeu commercial, Parcours Moniteur répond à un enjeu de **sécurité routière** : des séances mieux préparées, avec des points d'intérêt adaptés au niveau de l'élève, contribuent à une meilleure pédagogie et à une réduction des risques en situation réelle.

## 4. Objectifs du projet

### Objectif principal

Développer une application mobile permettant aux moniteurs d'auto-école :

- d'accéder à une carte interactive
- d'identifier rapidement des points d'intérêt pertinents pour l'apprentissage
- d'organiser leurs séances de conduite

### Objectifs secondaires

- réduire le temps de préparation des séances
- mutualiser les points d'intérêt entre utilisateurs
- proposer un outil simple, rapide et utilisable en situation réelle

### Indicateurs de succès (KPIs)

| Indicateur | Objectif cible |
| --- | --- |
| Satisfaction des 13 testeurs | ≥ 4/5 sur l'ensemble des critères évalués |
| Nombre de points d'intérêt créés pendant la phase de test | ≥ 30 points |
| Taux d'adoption | ≥ 80 % des testeurs utilisent l'app au moins 2 fois |
| Taux d'anomalies bloquantes en recette | 0 anomalie **bloquante** à la livraison |

## 5. Périmètre fonctionnel retenu

### Fonctionnalités incluses

**Compte & authentification**

| # | Fonctionnalité |
|---|---|
| F-01 | Création de compte |
| F-02 | Connexion passwordless |
| F-03 | Profil utilisateur |
| F-04 | Suppression du compte (RGPD) |

**Carte**

| # | Fonctionnalité |
|---|---|
| F-05 | Affichage de la carte interactive |
| F-06 | Géolocalisation utilisateur |

**Points d'intérêt**

| # | Fonctionnalité |
|---|---|
| F-08 | Consultation d'un point d'intérêt |
| F-09 | Fréquentation par créneau horaire |
| F-10 | Filtres de points d'intérêt |
| F-11 | Ajout de point d'intérêt (back-office) |
| F-12 | Retrait de point d'intérêt (back-office) |
| F-13 | Demande de modification depuis l'app mobile |
| F-14 | Traitement des demandes de modification (back-office) |
| F-15 | Points d'intérêt favoris |
| F-16 | Création d'une liste de points d'intérêt |
| F-17 | Consultation d'une liste |
| F-18 | Suppression d'une liste |
| F-19 | Partage d'un point d'intérêt |

**Attributs des points d'intérêt**

| # | Fonctionnalité |
|---|---|
| F-20 | Dénivelé (légère, moyenne, pentue) |
| F-21 | Caractéristiques de voie (giratoire, carrefour, céder le passage, limitations…) |

**Itinéraires**

| # | Fonctionnalité |
|---|---|
| F-22 | Création d'itinéraire |
| F-23 | Sauvegarde d'itinéraire |
| F-24 | Consultation d'itinéraire |
| F-25 | Suppression d'itinéraire |
| F-26 | Lancement avec affichage du chemin optimal sur la carte |

**Offline**

| # | Fonctionnalité |
|---|---|
| F-27 | Consultation hors connexion |
| F-28 | Saisie hors connexion |
| F-29 | Synchronisation au retour en ligne |

**Back-office (desktop)**

| # | Fonctionnalité |
|---|---|
| F-30 | Accès desktop uniquement |
| F-31 | Gestion des utilisateurs |
| F-32 | Validation des points d'intérêt et des demandes de modification |

### Fonctionnalités exclues du MVP (validées avec le client)

| # | Fonctionnalité | Description | Justification |
|---|---|---|---|
| F-07 | Trafic en temps réel | Visualiser le trafic en temps réel sur la carte | Dépendance à des API tierces payantes — reporté en V2 |
| F-33 | Version gratuite | Accès à la carte et consultation des points d'intérêt sans abonnement | Hors périmètre MVP — reporté en V2 |
| F-34 | Version payante | Accès aux fonctionnalités avancées (itinéraires, filtres avancés) via abonnement | Hors périmètre MVP — reporté en V2 |
| F-35 | Compte auto-école (B2B) | Partage de points d'intérêt au sein d'une structure, gestion d'équipe | Hors périmètre MVP — reporté en V2 |
| — | Déploiement international | Extension de l'application hors France | Évolution long terme |

### Fonctionnalités en POC (hors MVP, faisabilité à évaluer)

| # | Fonctionnalité | Justification |
|---|---|---|
| F-36 | Génération automatique de points d'intérêt | Objet du POC Phase 2 — les points générés passent par le flux de validation back-office |
| F-37 | Compatibilité CarPlay / Android Auto | Complexité technique à évaluer — non bloquant pour la livraison |

## 6. Choix techniques

### Application mobile

- **React Native + Expo**
  - cible prioritaire : **Android** (Google Play Store pour la phase de test)
  - extension iOS possible sans refonte grâce à la base de code unique
  - réduction des coûts et délais de développement
  - support du mode offline natif (mise en cache des données et tuiles cartographiques)

### Back-office

- **React**
  - cohérence technique avec le front mobile
  - mutualisation des compétences

### UI

- **Tailwind CSS** — développement rapide, cohérence visuelle, flexibilité

### Cartographie

- **OpenStreetMap**
  - données libres, sans dépendance propriétaire
  - cohérence avec la contrainte de souveraineté
  - accessibilité et richesse des données cartographiques

### Back-end

- **API REST (Next.js)**
  - stack unifié React / Next.js sur l'ensemble du projet (mobile, back-office, API)
  - syntaxe cohérente sur toutes les briques — facilite la reprise et la maintenance par le client ou un futur développeur
  - réduit la fragmentation technologique et le coût de montée en compétence

### Base de données

- **PostgreSQL** — structuration relationnelle, robustesse, évolutivité

### Authentification

- **Système passwordless par email** (code temporaire + token JWT)
  - simplicité pour l'utilisateur
  - sécurité accrue (aucun mot de passe stocké)
  - réduction des risques liés aux fuites de données

### Déploiement

- distribution via Google Play Store (phase de test)
- backend hébergé sur VPS français ou européen — le choix de l'hébergeur sera arrêté lors d'une réunion dédiée avec le client

### Outils de suivi

- **Notion** : gestion des tâches, suivi du projet, documentation partagée avec le client

## 7. Architecture (simplifiée)

- Application mobile (React Native + Expo)
- Back-office web (React)
- API backend (Next.js)
- Base de données PostgreSQL

## 8. Stratégie de réalisation

Afin de respecter les contraintes de budget et de délai (livraison juillet–août), le projet est structuré en deux phases distinctes.

### Phase 1 — MVP fonctionnel

**Objectif :** déployer une première version fonctionnelle permettant de valider l'intérêt du produit et les usages principaux.

**Contenu :**

- application mobile (React Native + Expo)
- back-office desktop (React)
- API centralisée (Next.js)

**Finalité :**

- utilisation réelle par 13 testeurs
- validation des usages métier
- collecte de feedback utilisateur

### Phase 2 — POC

**Objectif :** étudier la faisabilité technique de la génération automatique de points d'intérêt et de la compatibilité CarPlay / Android Auto.

**Contenu :**

- prototype technique isolé
- exploitation de données cartographiques (OpenStreetMap)
- tentative d'identification automatique de points d'intérêt pertinents

**Finalité :**

- évaluer la faisabilité technique
- identifier les contraintes
- estimer la complexité d'industrialisation

Ces POC n'ont pas vocation à produire des fonctionnalités finalisées, mais à valider des concepts techniques.

## 9. Planning de réalisation

| Phase | Période | Durée |
|---|---|---|
| Conception | Avril 2026 | ~1 semaine |
| Développement MVP | Mai – juin 2026 | ~8 semaines |
| Recettage & corrections | Juillet 2026 | ~1 semaine |
| Livraison | Fin juillet 2026 | ~3 jours |
| POC | Août – septembre 2026 | ~4 semaines |
| **Total** | **Avril – septembre 2026** | **~14 semaines** |

## 10. Budget

Le budget de 20 000 € est celui alloué par le client pour le projet. Il couvre la réalisation de l'application mobile et du back-office. L'hébergement de l'infrastructure est à la charge du client.

*Les durées indiquées correspondent aux semaines de production effective. Le planning intègre en sus les temps de suivi client, de validation et d'ajustements.*

| Poste | Durée | Estimation |
|---|---|---|
| Conception | ~1 semaine | ~2 000 € |
| Développement application mobile (React Native) | ~4 semaines | ~11 000 € |
| Développement back-office + API | ~1,5 semaine | ~4 000 € |
| Recettage, corrections, livraison | ~1,5 semaine | ~2 000 € |
| POC (Phase 2) | ~1 semaine | ~1 000 € |
| **Total** | **~9 semaines de production** | **~20 000 €** |

## 11. Risques identifiés

| Risque | Niveau | Mesure |
|---|---|---|
| Qualité et précision des données cartographiques | Moyen | Validation des points d'intérêt via back-office avant publication |
| Complexité du mode offline | Élevé | Priorisé dans le MVP, à surveiller pendant le développement |
| Faisabilité de l'automatisation | Élevé | Isolée dans un POC distinct, non bloquante pour la livraison |
| Délai serré (2 mois de dev effectif) | Élevé | Périmètre réduit au strict nécessaire, priorisation claire |
| Non-conformité RGPD | Moyen | Consentement intégré dès le MVP, hébergement France |

## 12. Modalités de pilotage

- Outil de gestion : **Notion** (accessible client et prestataire) — tâches, documentation, suivi d'avancement

| Fréquence | Type de point | Contenu |
|---|---|---|
| **Bihebdomadaire** | Point de suivi court (30 min) | Avancement des tâches, blocages, ajustements |
| **Fin de phase** | Réunion de validation (1h) | Démo, validation client, go/no-go pour la phase suivante |
| **En continu** | Alerte immédiate | Toute dérive budget ou délai signalée sans attendre le prochain point |

- Validation client obligatoire avant passage à la phase suivante
- Reporting synthétique partagé sur Notion après chaque réunion de phase

## 13. Conclusion

La solution proposée repose sur un MVP centré sur les fonctionnalités essentielles, permettant de répondre efficacement au besoin tout en respectant les contraintes du projet.

Le découpage en deux phases permet de sécuriser la livraison et de limiter les risques, tout en préparant les évolutions futures (CarPlay, automatisation des points d'intérêt).

---

**Validation de la note de cadrage**

- Client : Mélicia LENCI
- Prestataire : Alonzo MATHON & Lucie PELLETIER
- Date : ........................................
