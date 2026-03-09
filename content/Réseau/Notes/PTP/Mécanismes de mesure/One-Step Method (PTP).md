---
tags:
  - définition
  - statut/ébauche
aliases:
  - One-Step
  - One-Step Method
---
**Méthode d'horodatage des [[Message PTP|messages PTP]].** 

- L'horloge est capable d'inscrire l'heure exacte de départ directement à l'intérieur du [[Sync (Message PTP)|message Sync]] ou [[Pdelay_Response (Message PTP)|Pdelay_Resp]] au moment où il quitte le port de sortie.  
- Il n'y a pas besoin de [[Follow_Up (Message PTP)|message Follow_Up]] ou [[Pdelay_Response_Follow_Up (Message PTP)|Pdelay_Response Follow_Up]]. Cela diminue la charge du processeur des horloges.  
- Mode nécessitant un matériel capable d'horodatage à la transition entre la couche 2 et la couche 1.  