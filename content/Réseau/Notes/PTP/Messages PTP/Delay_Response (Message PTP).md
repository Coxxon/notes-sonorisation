---
tags:
  - définition
aliases:
  - Delay_Resp
  - message Delay_Resp
  - Delay_Response
  - messages Delay_Resp
---
# Delay_Response (Message PTP)

**Message envoyé par la [[Master Clock]] aux [[Follower Clock|Follower Clocks]] en mode [[End-to-End (E2E)|End-to-End]].**

- Ce message est envoyé en réponse à un [[Delay_Request (Message PTP)|Delay_Request]].  
- Il contient l'heure précise de réception de la requête, permettant ainsi aux [[Follower Clock|Follower Clocks]] de calculer le délai de propagation global qui les sépare de leur [[Master Clock]].  
