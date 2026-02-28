---
tags:
  - définition
---
# Root Bridge  

**Le switch de référence central de la [[Topologie|topologie logique]].**  
Il est élu car il possède le **[[Bridge ID (BID)|BID]]** le plus bas du réseau.

- **Rôle :** Il génère les [[BPDU (Bridge Protocol Data Unit)|BPDU]] de configuration et sert de "point zéro" pour tous les calculs de [[Réseau/Notes/RSTP/Topologie/Path Cost|Path Cost]].
- **Statut :** Tous ses ports actifs sont obligatoirement des **[[Designated Port (DP)|Designated Ports]]**.