---
tags:
  - définition
aliases:
  - buffers
  - buffer
  - mémoire tampon
---
# Buffer (Mémoire tampon)

**Mémoire temporaire permettant d'absorber les variations de flux de données.**

Le Buffer met les données en attente avant leur traitement ou transmission. Il sert d'interface entre deux systèmes qui ne fonctionnent pas à la même vitesse.

- **En réseau** : Retient les [[Trame Ethernet|trames]] dans un switch lors des pics de trafic (ce qui génère du [[Jitter]]).
- **En audio numérique** : Accumule les échantillons (_samples_) avant leur calcul par le processeur pour éviter les micro-coupures.

**Règle générale** : Un buffer plus grand assure un signal sans interruption (plus grande sécurité contre les pertes de paquets), mais augmente mécaniquement la **[[Latence]]**.