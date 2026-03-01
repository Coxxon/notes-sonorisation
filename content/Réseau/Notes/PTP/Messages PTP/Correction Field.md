---
tags:
  - définition
aliases:
---
# Correction Field  

**Champ de données spécifique intégré dans l'en-tête des [[Message PTP|messages PTPv2]].**  

- Il est modifié par les [[Transparent Clock|Transparent Clocks]] qui y indiquent le [[Residence Time]] des [[Message PTP|messages PTP]] qui le traversent, ainsi que le [[Peer Delay]] en mode [[Peer-to-Peer (P2P)|P2P]].  
- Cela permet à l'horloge destinataire d'un [[Message PTP|messages PTP]] de corriger le retard dû à leur passage dans des switches, et ainsi de neutraliser le [[Jitter]].  