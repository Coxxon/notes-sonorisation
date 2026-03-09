---
tags:
  - définition
---
# Loop-Inconsistent

**État de protection lié à [[Loop Guard]].**

Cet état survient lorsqu'un [[Root Port (RP)|Root Port]] ou [[Alternate Port (AP)|Alternate Port]] cesse brusquement de recevoir des [[BPDU (Bridge Protocol Data Unit)|BPDU]] (souvent à cause d'un [[Segment|lien]] unidirectionnel).  
Au lieu de passer en état [[Forwarding]] et de risquer une boucle, [[Loop Guard]] place le port en Loop-Inconsistent.