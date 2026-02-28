---
aliases:
  - BMCA
  - Best Master Clock Algorithm
tags:
  - définition
---
# Best Master Clock Algorithm (BMCA)

**Le BMCA est l'algorithme qui permet l'élection de la [[Grandmaster Clock (GMC)|Grandmaster Clock]] du [[Precision Time Protocol (PTP)|PTP]].**  

Il utilise les données contenues dans les [[Announce (Message PTP)|messages Announce]] envoyés par chaque horloge sur le réseau.  

1. **Priority 1** : Valeur configurable comprise en 0 et 255, plus la valeur est basse plus la priorité est haute.
2. **Clock Class** : Valeur comprise en 0 et 255, plus la valeur est basse plus la priorité est haute. 
    - **6** : Synchronisée sur une source externe primaire (GPS, Horloge Atomique).
    - **7** : Était sur GPS mais a perdu le signal (mode Holdover).
    - **248** : Valeur par défaut (Oscillateur interne libre).
3. **Clock Accuracy** : Valeur hexadécimale comprise entre 0 et 31. La valeur est attribuée en fonction de la dérive de l'horloge par rapport au temps de référence. Plus la valeur est basse plus la priorité est haute.
4. **Clock Variance** : Mesure la stabilité de l'oscillateur. Plus l'oscillateur est stable, plus la variance est basse.
5. **Priority 2** : Valeur configurable comprise en 0 et 255, plus la valeur est basse plus la priorité est haute. Sert à départager deux machines identiques dont tous les paramètres précédents sont identiques.
6. **Clock Identity** : **L'adresse MAC la plus basse gagne.**