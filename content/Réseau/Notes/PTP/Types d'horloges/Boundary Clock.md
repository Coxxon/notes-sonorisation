---
tags:
  - définition
aliases:
  - Boundary Clocks
---
# Boundary Clock  

**Mode de fonctionnement d'un switch agissant comme un relais d'horloge.**

La Boundary Clock synchronise son horloge interne sur une [[Master Clock]] (souvent sur la [[Grandmaster Clock (GMC)|GMC]]) avant de générer de nouveaux messages PTP pour distribuer un niveau hiérarchique inférieur d'horloges.  

- Port d'entrée : agit comme [[Follower Clock]] de l'horloge source.
- Ports de sortie : agissent comme [[Master Clock]] des équipements en aval.  

Avantages :  

- **Réduction de la charge de la [[Master Clock]]** qui ne dialogue qu'avec les switches en Boundary Clock plutôt que chacun des [[Appareil terminal|appareils terminaux]].
- **Isolation du réseau** : Les messages demande de délai sont gérés localement par le switch.
