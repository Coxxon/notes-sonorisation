---
aliases:
  - Peer-to-Peer
  - P2P
tags:
  - définition
---
# Peer-to-Peer (P2P)

**Mécanisme de mesure du délai [[segment]] par [[segment]] entre [[Master Clock]] et [[Follower Clock]] en [[Precision Time Protocol (PTP)|PTP]].**

- Chaque équipement mesure uniquement le délai de propagation des [[Trame Ethernet|trames]] sur le [[Segment|lien]] qui le relie à son voisin direct (son Peer).  
- Le délai total entre la [[Master Clock]] et les [[Follower Clock|Follower Clocks]] est calculé en faisant la somme des délais de chaque [[segment]] qui incluent les [[Residence Time|temps de résidence]] des switches.  
- Ce mode utilise les messages **Pdelay_Req** et **Pdelay_Resp**.  
