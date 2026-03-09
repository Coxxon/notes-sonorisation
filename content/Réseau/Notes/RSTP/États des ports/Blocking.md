---
tags:
  - définition
---

# Blocking 

État d'un port **en [[Spanning Tree Protocol (STP) et Rapid-STP (RSTP)|STP]]. 

Dans cet état, le port est logiquement "bloqué" pour empêcher la création d'une boucle réseau.  
Le switch ne transmet aucune donnée utilisateur et n'apprend pas d'adresses MAC.  
Cependant, le port continue d'écouter les trames [[BPDU (Bridge Protocol Data Unit)|BPDU]] afin de pouvoir réagir si le [[Segment|lien]] principal tombe.