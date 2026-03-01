---
tags:
  - définition
---
# Time-Aware Bridge

**Switch réseau agissant comme relais d'horloge spécifique au standard [[Precision Time Protocol (PTP)|gPTP]].**

Le Time-Aware Bridge est l'équivalent d'une [[Boundary Clock]] pour les réseaux AVB/TSN.  
Il rend la présence de [[Transparent Clock|Transparent Clocks]] impossible et inutile.

- **Fonctionnement** : Synchronise son horloge locale sur son port d'entrée ([[Follower Clock]]) et génère de nouveaux messages de synchronisation sur ses ports de sortie ([[Master Clock]]).
- **Obligation** : Dans un réseau gPTP, chaque switch matériel _doit_ être un Time-Aware Bridge pour garantir le calcul des délais câble par câble en mode [[Peer-to-Peer (P2P)|P2P]].