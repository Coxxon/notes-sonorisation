---
aliases:
  - Pdelay_Response Follow_Up
  - message Pdelay_Response Follow_Up
  - messages Pdelay_Response Follow_Up
  - Pdelay_Resp_Follow_Up
  - message Pdelay_Resp_Follow_Up
  - messages Pdelay_Resp_Follow_Up
tags:
  - définition
  - statut/ébauche
---
# Pdelay_Response_Follow_Up (Message PTP)  

**Message complémentaire au [[Pdelay_Response (Message PTP)|Pdelay_Resp]].**

- Utilisé uniquement en mode [[Two-Step Method (PTP)|Two-Step]].  
- Le message Follow_up contient l'horodatage du moment exact où le [[PDelay_Request (Message PTP)|message Pdelay_Req]] est sorti du port de la [[Master Clock]].  
- En mode [[One-Step Method (PTP)|One-Step]], ce message est inexistant car l'heure est insérée directement dans le [[PDelay_Request (Message PTP)|message Pdelay_Req]].