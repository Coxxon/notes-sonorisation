---
aliases:
  - BPDU
  - BPDUs
  - TCN
  - Topology Change Notification
  - Topology Change Notification (TCN)
  - Configuration BPDU
  - Configuration BPDUs
  - Config BPDU
  - Config BPDUs
---
# BPDU (Bridge Protocol Data Unit)
**Trame de communication échangée entre les switches.**  
Permet d'informer le réseau de qui est [[Root Bridge]] et de prévenir des changements de [[topologie]] afin de mettre en œuvre les mécanismes de redondance.

- **Contenu :** [[Bridge ID (BID)|BID]], Coût vers la racine, Timers, Flags de changement de [[topologie]].
- **Types :** **Configuration** (routine) ou **TCN** (alerte de changement).