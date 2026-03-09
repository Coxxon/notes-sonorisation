---
aliases:
  - E2E
  - End-to-End
tags:
  - définition
---
# End-to-End (E2E)

**Mécanisme de mesure du délai global entre [[Master Clock]] et [[Follower Clock]] en [[Precision Time Protocol (PTP)|PTP]].**

- Les [[Follower Clock]] calculent le temps de trajet total des messages sur l'ensemble du réseau, de la [[Master Clock|Master Clock]] jusqu'à elles.  
- En [[Precision Time Protocol (PTP)|PTPv1]], les switches sont traversés par le signal sans que leur [[Residence Time|temps de résidence]] ne soit inscrit dans les [[Sync (Message PTP)|messages Sync]] ce qui augmente le [[Jitter]].  
- En [[Precision Time Protocol (PTP)|PTPv2]], Les switches situés sur le trajet ajoutent chacun leur [[Residence Time|temps de résidence]] dans le [[Correction Field]] des messages pour que les [[Follower Clock|Follower Clocks]] puissent déduire le délai induit par les équipements traversés.