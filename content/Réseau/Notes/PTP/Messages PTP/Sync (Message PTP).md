---
tags:
  - définition
aliases:
  - message Sync
  - messages Sync
  - Sync
---
# Sync (Message PTP)  

**Message de synchronisation principal envoyé par la [[Master Clock]].  **

Le message Sync est envoyé périodiquement par la [[Master Clock]] à tous les appareils du réseau.  
Il contient l'heure de référence qui sert de base à la synchronisation.  

- [[One-Step Method (PTP)|One-Step Method]] : l'heure est inscrite dans le [[Follow_Up (Message PTP)|message Follow_Up]] qui suit l'envoi du [[Sync (Message PTP)|message Sync]].
- [[Two-Step Method (PTP)|Two-Step Method]] : l'heure est inscrite directement dans le message Sync.

 