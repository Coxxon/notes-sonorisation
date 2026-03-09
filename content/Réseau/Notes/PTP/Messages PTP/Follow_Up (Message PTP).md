---
tags:
  - définition
aliases:
  - message Follow_Up
  - Follow_Up
---
# Follow_up (Message PTP)

**Message complémentaire au [[Sync (Message PTP)|message Sync]].**  

- Utilisé uniquement en mode [[Two-Step Method (PTP)|Two-Step]].  
- Le message Follow_up contient l'horodatage du moment exact où le [[Sync (Message PTP)|message Sync]] est sorti du port de la [[Master Clock]].  
- En mode [[One-Step Method (PTP)|One-Step]], ce message est inexistant car l'heure est insérée directement dans le [[Sync (Message PTP)|message Sync]].