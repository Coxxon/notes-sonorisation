---
aliases:
  - blocking port
  - blocking ports
tags:
  - définition
---

# Blocking Port (BP)  

Rôle d'un port **en [[Spanning Tree Protocol (STP) et Rapid-STP (RSTP)|STP]].

Ce rôle est attribué à tout port qui n'a été élu ni comme [[Root Port (RP)|Root Port]], ni comme [[Designated Port (DP)|Designated Port]].  
Pour éviter une boucle réseau, le switch place ce port dans l'état [[Blocking]].  
Bien qu'il ne transmette aucune donnée utilisateur, il reste en attente, prêt à devenir actif si un [[Segment|lien]] principal tombe.