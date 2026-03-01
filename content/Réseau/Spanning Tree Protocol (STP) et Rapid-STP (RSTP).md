---
tags:
  - fondamentaux
order: 2
aliases:
  - Spanning Tree Protocol
  - STP
  - Rapid Spanning Tree Protocol
  - RSTP
  - Spanning Tree
---
# Spanning Tree Protocol (STP) et Rapid-STP (RSTP)

Le Spanning Tree Protocol permet de créer des [[Segment|liens]] de redondance dans un réseau Ethernet sans créer de boucles.  
Le principe : mettre en "veille" des ports sur les [[Segment|liens]] de redondance créant ainsi des [[Segment|liens]] dormant, prêts à être réactivés en cas de défaillance du [[Segment|lien]] actif.  
Tout est géré automatiquement par le protocole en interne des switches, mais il est possible de forcer cette organisation pour quelle soit adaptée à nos besoins.
Le Spanning Tree Protocol est ce qui détermine la **[[Topologie|topologie logique]]** d'un réseau (comment les switches sont interconnectés logiciellement), qui n'est pas nécessairement calquée sur sa **[[Topologie|topologie physique]]** (comment les switches sont interconnectés physiquement).

---
## Règles de priorité

Des processus d'**auto-élection** ont lieu entre les switches afin de définir la [[Topologie|topologie logique]] d'un réseau. Ces processus sont influencés par les paramètres suivants :

1. [[Path Cost]]
2. [[Bridge ID (BID)|Bridge ID]]
3. [[Port ID]]

---
### 1. Path Cost

Valeur numérique attribuée à un chemin entre deux ports permettant de hiérarchiser les chemins selon leur "coût" de déplacement. C'est l'unité de mesure du protocole pour déterminer le chemin le plus efficace.

Le [[Path Cost]] est inversement proportionnel au débit.

| **Débit**    | Short [[Path Cost]] (STP) | Long [[Path Cost]] (RSTP) |
| ------------ | --------------------- | --------------------- |
| **10 Mbps**  | 100                   | 2 000 000             |
| **100 Mbps** | 19                    | 200 000               |
| **1 Gbps**   | 4                     | 20 000                |
| **10 Gbps**  | 2                     | 2 000                 |

---
### 2. Bridge ID (BID)

Identifiant unique d'un switch dans le réseau.

**[[Bridge ID (BID)|Bridge ID]] = [[Bridge Priority]] + [[Adresse MAC]]**

La [[Bridge Priority]] est une valeur déterminée par l'administrateur réseau pour chaque switch.
- **Plage :** 0 à 61 440 avec incrémentation de 4 096
- **Valeur par défaut :** 32 768
- **Règle :** Plus la valeur est basse, plus le switch est prioritaire
- En cas d'égalité, c'est l'[[Adresse MAC]] la plus faible qui a la priorité

>[!NOTE] **"Bridge"** désigne ici un switch. Il s'agit du nom d'un appareil ancêtre du switch, son nom est resté dans les appellations du protocole.

---
### 3. Port ID

**[[Port ID]] = [[Port Priority]] + numéro de port**

La [[Port Priority]] est une valeur déterminée par l'administrateur réseau pour chaque port.

- **Plage de valeurs :** 0 à 240 avec incrémentation de 16
- **Valeur par défaut :** 128
- **Règle :** Plus la valeur est basse, plus le port est prioritaire
- En cas d'égalité, c'est le numéro de port le plus faible qui a la priorité

---
## Rôles des ports et hiérarchie

### Root Bridge

Le [[Root Bridge]] est le switch qui centralise la [[Topologie|topologie logique]] du réseau, il dicte aux autres switches quels chemins emprunter pour acheminer les données sans créer de boucles.
Dans un réseau, le [[Root Bridge]] est le switch qui a le [[Bridge ID (BID)|BID]] le moins important.

> [!Exemple]
> 
> ![[RSTP-1_4SW_ROOT_BRIDGE.svg|700]]
> 
> 
> SW1 et SW2 ont la priorité la plus basse, il faut donc les départager par leur adresse MAC. 00:50:C2:00:51 < 00:50:C2:00:a1
> C'est donc SW1 qui est élu [[Root Bridge]].

---
### Root Port (RP)

Le [[Root Port (RP)|Root Port]] correspond - sur un [[Segment|lien]] entre deux switches - au port actif offrant le chemin le plus efficace vers le [[Root Bridge]]. 
C'est par ce port qu'un switch "écoute" les instructions provenant du [[Root Bridge]].
Le [[Path Cost|Root Path Cost]] correspond aux [[Réseau/Notes/RSTP/Topologie/Path Cost|Path Costs]] cumulés de tous les [[Segment|segments]] à traverser pour atteindre le [[Root Bridge]].

- Il y a **un seul [[Root Port (RP)|Root Port]] par switch hors [[Root Bridge]].**
- **Le [[Root Bridge]] n'a aucun [[Root Port (RP)|Root Port]].**
- En cas d'égalité de coût, le switch utilise des critères de départage ([[Bridge ID (BID)|Bridge ID]] puis [[Port ID]]).

> [!Exemple]
> 
> ![[RSTP-2_4SW_ROOT_PORT.svg|700]]
> 
> 
> 
> Pour SW2 : le chemin le plus court pour atteindre le [[Root Bridge]] a un coût de 2.000. Le [[Root Port (RP)|Root Port]] est donc le port 19.
> 
> Pour SW3 : le chemin le plus court pour atteindre le [[Root Bridge]] a un coût de 2.000. Deux chemins possibles ont ce même coût, on les départage donc en fonction du port ID le plus bas côté [[Root Bridge]], c'est donc le port 20 de SW3 qui devient [[Root Port (RP)|Root Port]], puisqu'il est connecté au port 19 de SW1 (Port ID inférieur au port 20 de la liaison voisine)
> 
> Pour SW4 : le chemin le plus court pour atteindre le [[Root Bridge]] a un coût de 4.000. Le [[Root Port (RP)|Root Port]] est donc le port 20.

---
### Designated Port (DP)

Le [[Designated Port (DP)|Designated Port]] correspond - sur chaque [[segment]] du réseau - au port qui est le plus proche du [[Root Bridge]] selon le [[Path Cost]].
C'est par ce port qu'un switch transmet les données qui viennent du [[Root Bridge]] aux switches en aval.

- Il y a **un seul [[Designated Port (DP)|Designated Port]] par [[segment]]**
- **Tous les ports actifs du [[Root Bridge]] sont des [[Designated Port (DP)|Designated Ports]]**
- **Un port ne peux pas être à la fois [[Root Port (RP)|Root Port]] et [[Designated Port (DP)|Designated Port]]**
- En cas d'égalité de coût, le switch utilise des critères de départage ([[Bridge ID (BID)|Bridge ID]] puis [[Port Priority]])

> [!Exemple]
> 
> ![[RSTP-3_4SW_DESIGNATED_PORT.svg|700]]
> 
> 
> SW1 étant [[Root Bridge]], tous ses ports actifs sont automatiquement élus Designated Ports. 
> 
> Pour la liaison entre SW2 et SW4, le [[Root Port (RP)|Root Port]] est déjà choisi donc le port 20 de SW2 devient Designated Port. 
> 
> Pour la liaison entre SW3 et SW4, le chemin le plus court pour atteindre SW1 est celui qui part de SW3, c'est donc le port 10 de SW3 qui devient Designated Port.

---
### Alternate Port (AP, en RSTP) ou Blocking Port (BP, en STP)

Un [[Alternate Port (AP)|Alternate Port]] est un port qui n'a été élu été ni comme [[Root Port (RP)|Root Port]], ni comme [[Designated Port (DP)|Designated Port]].  
Pour éviter une boucle qui résulterait en une [[tempête de broadcast]], le switch bloque ce port. Un [[Alternate Port (AP)|port alternatif]] ne transmet aucune donnée utilisateur, cependant il continue de recevoir et d'analyser les messages de configuration émanant du [[Root Bridge]].  
Si le [[Root Port (RP)|Root Port]] ne reçoit plus d'informations du [[Root Bridge]], le switch consulte la mémoire des informations reçues par l'[[Alternate Port (AP)|Alternate Port]], pour vérifier que le chemin est toujours valide. Il prend le relai (à condition d'être l'[[Alternate Port (AP)|Alternate Port]] prioritaire du switch) et devient à son tour [[Root Port (RP)|Root Port]].

> [!Exemple]
> 
> ![[RSTP-4_4SW_ALTERNATE_PORT.svg|700]]
> 
> 
> Les ports restants deviennent tous des Alternate Ports.

---
## BPDU (Bridge Protocol Data Unit)

Les [[BPDU (Bridge Protocol Data Unit)|BPDU]] sont des messages de configuration envoyés par les switches en [[multicast]] aux autres switches. Ils contiennent toutes les informations permettant aux processus d'auto-élection d'avoir lieu. À travers les [[BPDU (Bridge Protocol Data Unit)|BPDU]] un switch peut communiquer son [[Bridge ID (BID)|BID]], son [[Port ID]], et calculer le [[Path Cost|Root Path Cost]].

Il existe deux types de messages [[BPDU (Bridge Protocol Data Unit)|BPDU]] :

1. **Configuration [[BPDU (Bridge Protocol Data Unit)|BPDU]]** : Le message qui est envoyé à la fréquence indiquée par le [[Hello Time]] (2 secondes par défaut). Il permet de maintenir la [[topologie]] en place.  
2. **[[BPDU (Bridge Protocol Data Unit)|Topology Change Notification]] ([[BPDU (Bridge Protocol Data Unit)|TCN]])** : Signal d'alarme envoyé par un switch lorsqu'il détecte qu'un port tombe ou s'allume. Un [[BPDU (Bridge Protocol Data Unit)|TCN]] est envoyé vers le [[Root Bridge]] pour prévenir de la nécessite de rafraîchir les [[Table d'adresses MAC|tables d'adresses MAC]].

#### Tableau des octets d'une trame Configuration [[BPDU (Bridge Protocol Data Unit)|BPDU]]

| **Champ**                                                     | **Taille** | **Description technique**                                                                                                             |
| ------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Protocol ID**                                               | 2 octets   | Identifie le protocole Spanning Tree.                                                                                                 |
| **Version**                                                   | 1 octet    | Permet au switch de détecter le protocole utilisé en face.                                                                            |
| **[[BPDU (Bridge Protocol Data Unit)\|BPDU]] Type**           | 1 octet    | En STP, [[BPDU (Bridge Protocol Data Unit)\|Config BPDU]] ou [[BPDU (Bridge Protocol Data Unit)\|TCN]].<br>En RSTP, un seul type.     |
| **Flags**                                                     | 1 octet    | En STP, utilisé pour notifier des changements de [[topologie]].<br>En RSTP, utilisé pour la [[négociation active]] entre les switchs. |
| **Root ID**                                                   | 8 octets   | Root [[Bridge ID (BID)]]                                                                                                              |
| **[[Path Cost\|Root Path Cost]]**                              | 4 octets   | Distance totale vers le [[Root Bridge]].                                                                                              |
| **[[Bridge ID (BID)\|BID]]**                                  | 8 octets   | [[Bridge ID (BID)\|BID]] de l'émetteur                                                                                                |
| **[[Port ID]]**                                               | 2 octets   | Identité du port qui a envoyé la trame.                                                                                               |
| **Message Age**                                               | 2 octets   | Nombre de sauts (hops) depuis la racine.                                                                                              |
| **[[Max Age]]**                                               | 2 octets   | Seuil de péremption du [[BPDU (Bridge Protocol Data Unit)\|BPDU]]                                                                     |
| **[[Hello Time]]**                                            | 2 octets   | Intervalle entre chaque envoi de [[BPDU (Bridge Protocol Data Unit)\|BPDU]]                                                           |
| **[[Forward Delay]]**                                         | 2 octets   | Temps de transition (Listening/Learning).                                                                                             |

---
### BPDU (STP)

#### Configuration [[BPDU (Bridge Protocol Data Unit)|BPDU]] (STP)

Toutes les deux secondes, le [[Root Bridge]] envoie en [[multicast]] une trame [[BPDU (Bridge Protocol Data Unit)|BPDU]] qui est relayée par les switches vers les switches suivants.  
Lorsqu'un switch reçoit un [[BPDU (Bridge Protocol Data Unit)|BPDU]], il le compare à celui qu'il a déjà en mémoire sur le même port. Le switch compare dans l'ordre :

1. **Lowest [[Root Bridge]] ID :** Est-ce que ce [[BPDU (Bridge Protocol Data Unit)|BPDU]] annonce un [[Root Bridge]] plus prioritaire que celui que je connais ?
2. **Lowest [[Path Cost|Root Path Cost]] :** Si c'est le même Root, est-ce que ce chemin est moins cher pour l'atteindre ?
3. **Lowest Sender [[Bridge ID (BID)|Bridge ID]] :** Si le coût est identique, est-ce que le switch qui m'envoie ça est plus prioritaire que mon voisin actuel ?
4. **Lowest Sender [[Port ID]] :** Si c'est le même switch voisin, est-ce qu'il m'envoie ça par un port plus prioritaire ?

> **Si le nouveau [[BPDU (Bridge Protocol Data Unit)|BPDU]] gagne ([[Superior BPDU]]), le switch met à jour sa mémoire.** Sinon, il ignore le [[BPDU (Bridge Protocol Data Unit)|BPDU]] ([[Inferior BPDU]]).

Pour le calcul du [[Path Cost|Root Path Cost]], la trame [[BPDU (Bridge Protocol Data Unit)|BPDU]] reçue par un switch sur son [[Root Port (RP)|Root Port]] est réécrite en ajoutant le coût de déplacement lié au port sur lequel la trame a été reçue, puis est à nouveau multicastée sur ses [[Designated Port (DP)|Designated Ports]] vers les switches suivants.

#### Topology Change Notification (STP)

Les messages [[BPDU (Bridge Protocol Data Unit)|TCN]] forcent les switches à rafraîchir leurs [[Table d'adresses MAC|tables d'adresses MAC]] en cas de changement de [[topologie]], pour éviter que les paquets ne soient envoyés à une destination qui n'est plus à jour.

1. Le switch qui détecte le changement envoie un [[BPDU (Bridge Protocol Data Unit)|TCN]] vers le [[Root Bridge]].
2. Le [[Root Bridge]] reçoit l'alerte et envoie un [[BPDU (Bridge Protocol Data Unit)|BPDU]] spécial à tout le réseau avec le flag TC (Topology Change).
3. Dès qu'un switch reçoit ce flag, il réduit le temps de vie de sa [[table d'adresses MAC]] de 300s à 15s.
4. C'est seulement après ces 15s que les anciennes adresses sont effacées et que les nouvelles routes sont apprises.

---
### BPDU (Bridge Protocol Data Unit)|BPDU RSTP

#### Configuration BPDU (RSTP)

Toutes les deux secondes, chaque switch envoie en [[multicast]] sa propre trame [[BPDU (Bridge Protocol Data Unit)|BPDU]], sans attendre de recevoir celle du [[Root Bridge]].  
Le processus de comparaison pour déterminer le [[Superior BPDU]] reste identique au STP (Root ID > Cost > [[Bridge ID (BID)|Bridge ID]] > [[Port ID]]). Cependant, le RSTP utilise activement l'octet **Flags** pour transformer le port :

1. **Le [[Handshake]] :** Lorsqu'un [[Segment|lien]] est établi, les switches utilisent les flags **[[Proposal]]** et **[[Agreement]]**.
2. **[[Négociation active]] :** Les switches négocient pour valider immédiatement le rôle de chaque port.
3. **Rétrocompatibilité :** Si un switch RSTP reçoit un [[BPDU (Bridge Protocol Data Unit)|BPDU]] Version 0 (STP), il bascule automatiquement le port concerné en mode STP classique pour assurer la communication.

> [!NOTE] **L'octet Flags à l'origine de la rapidité du RSTP**
> Cet octet contient les informations sur le rôle du port (Root, Designated, Alternate) et son état actuel, permettant aux switches voisins de se mettre d'accord en quelques millisecondes.

#### Topology Change Notification (RSTP)

Les messages [[BPDU (Bridge Protocol Data Unit)|TCN]] forcent les switches à rafraîchir leurs [[Table d'adresses MAC|tables d'adresses MAC]] en cas de changement de [[topologie]], pour éviter que les paquets ne soient envoyés à une destination qui n'est plus à jour.

1. Tout switch qui détecte un changement (un port non-edge qui passe en [[Forwarding]]) génère lui-même l'alerte.
2. Il envoie des [[BPDU (Bridge Protocol Data Unit)|BPDUs]] avec le flag TC à tous ses voisins sur ses ports actifs (Root et Designated).
3. Dès qu'un switch reçoit ce message, il vide instantanément sa [[table d'adresses MAC]] pour tous les ports (sauf celui par lequel il a reçu l'alerte).
4. Le réseau apprend les nouvelles routes en quelques millisecondes.

>[!WARNING] Il faut que les ports access soient configurés en mode Edge Port.
>Si ce n'est pas le cas, à chaque connexion ou déconnexion d'un appareil (comme un PC), un TCN est envoyé et tout le réseau doit passer par le processus de rafraichissement des tables d'adresses MAC, ce qui peut provoquer des instabilités.  
>Les Edge Ports ont la particularité de ne pas générer de TCN.

---
## Convergence Time

Le [[Convergence Time|temps de convergence]] désigne le temps nécessaire pour que les switches mettent à jour leur [[BPDU (Bridge Protocol Data Unit)|BPDU]] et s'adaptent à des changements de [[topologie]].
#### STP [[Convergence Time]]

En cas de coupure d'un [[segment]] actif, les [[Blocking Port (BP)|Blocking Ports]] passent par plusieurs états avant la promotion de l'un d'entre-eux en [[Root Port (RP)|Root Port]] : 
 
1. [[Blocking]] : Au moment où le [[Segment|lien]] est coupé, il se passe 20 secondes qui correspondent au [[Max Age]]. Cette étape peut sauter si le switch détecte que le câble a été physiquement débranché.
2. [[Listening (STP)]] : Pendant 15 secondes les ports en état [[blocking]] écoutent les [[BPDU (Bridge Protocol Data Unit)|BPDUs]] et en envoient dans le réseau pour annoncer leur priorité. À la fin de ce processus, le nouveau [[Root Port (RP)|Root Port]] est désigné.
3. [[Learning]] : 15 secondes pendant lesquelles le nouveau [[Root Port (RP)|Root Port]] remplit sa [[table d'adresses MAC]].
4. [[Forwarding]] : Le [[Root Port (RP)|Root Port]] commence à faire circuler les données.

>Total : de 30 à 50 secondes.

---
### RSTP Convergence Time

En cas de coupure d'un [[segment]] actif, le switch réagit très rapidement afin de rétablir la communication via un [[Alternate Port (AP)|Alternate Port]] :

1. Détection : Le switch attend 3 [[BPDU (Bridge Protocol Data Unit)|BPDU]] manquants (6 secondes) dans le cas d'une panne logique. En cas de panne physique, le port passe en état Link Down et cette étape est ignorée. les [[Alternate Port (AP)|Alternate Port]] restent en état [[Discarding]] (il n'écoute que les [[BPDU (Bridge Protocol Data Unit)|BPDU]])
2. [[Proposal]] : Le switch envoie un message depuis ses [[Alternate Port (AP)|Alternate Ports]] pour proposer de devenir [[Root Port (RP)|Root Port]].
3. [[Agreement]] : Le switch voisin valide la proposition pour l'[[Alternate Port (AP)|Alternate Port]] avec meilleure priorité.
4. [[Forwarding]] : Le nouveau [[Root Port (RP)|Root Port]] commence à faire circuler les données **dès la réception de l'[[Agreement]]**.

 >Total : de 10 millisecondes à 6 secondes.


---
## Sécurisation et optimisation

Le protocole Spanning Tree est basé sur la confiance : par défaut, n'importe quel équipement branché peut influencer la hiérarchie du réseau.  
Pour garantir sa stabilité, des mécanismes existent pour protéger le réseau et accélérer la connexion des [[Appareil terminal|appareils terminaux]].

---
### Edge Port|PortFast / Edge Port

**Passage instantané en [[Forwarding]].**  
Permet de brancher des [[Appareil terminal|appareils terminaux]] sans attendre les délais de Listening/Learning.

>[!ERROR] Boucle immédiate si on y branche un switch.

---
### BPDU Guard

**Désactive le port si un switch y est branché.**  
Permet de protéger la [[topologie]] contre un switch ou un routeur qui serait branché à un endroit imprévu. Si un [[BPDU (Bridge Protocol Data Unit)|BPDU]] est reçu sur un port avec cette option activée, le port passe en état [[Disabled|Error-Disabled]]

>[!CHECK] À activer sur les ports Access.

---
### BPDU Filter

**Ignore totalement le Spanning Tree.**  
Permet de faire passer des données utilisateur entre deux domaines de Spanning Tree différents sans modifier leurs [[Topologie|topologies logiques]] respectives. 

>[!ERROR] Risque de tempête de broadcast en cas de boucle comprenant un port avec cette option activée.

---
### Root Guard

**Empêche un switch branché sur le port de devenir [[Root Bridge]].**  
Si un [[Superior BPDU|BPDU supérieur]] est reçu sur un port avec cette option activée, le port passe en état [[Root-Inconsistent]], arrêtant le trafic.  
Il s'agit d'une protection descendante, on l'active sur les ports des switches en amont vers les switches en aval hiérarchiquement.

>[!WARNING] À activer sur les ports Access mais à utiliser avec précaution sur les trunks. Root Guard pourrait bloquer des liens de secours légitimes.

---
### Loop Guard

**Empêche les boucles provoquées par une liaison unidirectionnelle.**  
Si un seul brin de fibre est coupé, l'un des switches ne reçoit plus de [[BPDU (Bridge Protocol Data Unit)|BPDU]] sur ce [[Segment|lien]] et pourrait ouvrir son port, créant une boucle avec la moitié de [[Segment|lien]] restante.  
Un port avec cette option activée passe en état `Loop-Inconsistent` et empêche le port de devenir [[Designated Port (DP)|Designated Port]].

>[!CHECK] À activer sur les trunks.

---

## Variantes du Spanning Tree Protocol

Il existe différentes manières pour un switch de gérer le Spanning Tree. Certains modes permettent d'utiliser la [[Topologie|topologie logique]] optimale pour chaque [[VLAN (Virtual Local Area Network)]] en ayant plusieurs instances de STP actives, plutôt que d'avoir une seule instance commune à tous les [[VLAN (Virtual Local Area Network)|VLANs]]. 

- STP (CST : Common Spanning Tree) : Une seule instance pour tous les [[VLAN (Virtual Local Area Network)|VLANs]].
- RSTP : Une seule instance pour tous les [[VLAN (Virtual Local Area Network)|VLANs]].
- MSTP (Multiple STP) : Permet de grouper des [[VLAN (Virtual Local Area Network)|VLANs]] dans différentes instances.
- PVST (Per [[VLAN (Virtual Local Area Network)]] ST) / Rapid-PVST : Une instance par [[VLAN (Virtual Local Area Network)]] (Propriétaire Cisco).

