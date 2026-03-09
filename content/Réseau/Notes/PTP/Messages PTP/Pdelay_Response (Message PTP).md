---
aliases:
  - Pdelay_Resp
  - message Pdelay_Resp
tags:
  - définition
---
# Pdelay_Response (Message PTP)

**Réponse à un [[PDelay_Request (Message PTP)|message Pdelay_Req]] local en mode [[Peer-to-Peer (P2P)|Peer-to-Peer]] uniquement.**  

- Ce message est envoyé par un appareil à son voisin direct en réponse à un [[PDelay_Request (Message PTP)|Pdelay_Req]].  
- Il contient l'heure précise de réception de la requête, permettant ainsi aux deux voisins de calculer le délai de propagation exact du [[Segment|segment]].  
- Ce message ne traverse jamais les switches.