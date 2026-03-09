---
aliases:
  - root port
  - root ports
tags:
  - définition
---
# Root Port (RP)  

**Le port d'un switch offrant le meilleur chemin vers le [[Root Bridge]].**  
Chaque switch (sauf le [[Root Bridge]] lui-même) possède **un seul et unique** Root Port.

- **Fonction :** C'est par ce port que le switch reçoit les instructions du [[Root Bridge]].
- **Critère :** Élu selon le **[[Réseau/Notes/RSTP/Topologie/Path Cost|Root Path Cost]]** le plus faible.