---
tags:
  - définition
---
# Listening  

État d'un port **en [[Spanning Tree Protocol (STP) et Rapid-STP (RSTP)|STP]].

Dans cet état, le port traite les trames [[BPDU (Bridge Protocol Data Unit)|BPDU]] pour déterminer la [[topologie]] du réseau et définir son rôle ([[Root Port (RP)|Root Port]] ou [[Designated Port (DP)|Designated Port]]).  
Le port ne transmet aucune donnée utilisateur et **n'apprend pas encore** les adresses MAC afin d'éviter la création de boucles pendant la phase d'élection.