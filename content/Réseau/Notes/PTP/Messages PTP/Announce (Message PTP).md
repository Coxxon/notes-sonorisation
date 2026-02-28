---
aliases:
  - message Announce
  - messages Announce
  - Announce
tags:
  - définition
---
# Announce (Message PTP)

**Message envoyé par un appareil [[Precision Time Protocol (PTP)|PTP]] pour établir et maintenir la hiérarchie du réseau via l'algorithme [[Best Master Clock Algorithm (BMCA)|BMCA]].** 

Il contient les caractéristiques techniques de l'horloge émettrice.

- **Priorités** (1 et 2).
- **Clock Quality** (Class, Accuracy, Variance).
- **Clock Identity** (ID unique basé sur l'[[Adresse MAC]]).
- **Steps Removed** : Le nombre de sauts entre la [[Grandmaster Clock (GMC)|GMC]] et l'appareil émetteur.