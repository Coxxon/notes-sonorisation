---
tags:
  - définition
aliases:
  - Transparent Clocks
---
# Transparent Clock

**Mode de fonctionnement d'un switch capable de mesurer et communiquer son propre retard interne.**  

La Transparent Clock laisse transiter les messages [[Precision Time Protocol (PTP)|PTP]] sans s'y synchroniser.  
Elle mesure son [[Residence Time|temps de résidence]] pour chaque message et l'inscrit dans le champ de correction de la [[Trame Ethernet|trame]].  

- **En mode [[End-to-End (E2E)|E2E]]** : Le switch indique uniquement son temps de résidence interne.
- **En mode [[Peer-to-Peer (P2P)|P2P]]** : Le switch ajoute également le délai du [[Segment|segment]] amont, ce qui diminue la charge de calcul final de l'horloge de destination.  

Avantages :  

- **Neutralisation du [[Jitter]]** : Le retard variable induit par les files d'attente du switch est connu et annulé par les [[Follower Clock|Follower Clocks]].
- **Transparence hiérarchique** : Le switch n'altère pas l'architecture du [[PTP Domain]] (contrairement à la [[Boundary Clock]]).
