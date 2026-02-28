---
tags:
  - définition
aliases:
  - Two-Step
  - Two-Step Method
---
**Méthode d'horodatage des [[Message PTP|messages PTP]].**

Lorsqu'un [[Sync (Message PTP)|message Sync]] ou [[Pdelay_Response (Message PTP)|Pdelay_Resp]] est envoyé, l'horloge note dans sa mémoire l'heure exacte à laquelle le message quitte le port de sortie.  
- Un [[Follow_Up (Message PTP)|message Follow_Up]] ou [[Pdelay_Response_Follow_Up (Message PTP)|Pdelay_Response Follow_Up]] qui contient l'heure mise en mémoire est généré immédiatement après puis envoyé à son tour.  
- Mode compatible avec tout matériel.  

> [!NOTE] Il s'agit de la méthode d'horodatage unique de PTPv1.