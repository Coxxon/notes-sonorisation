---
tags:
  - fondamentaux
order: 3
aliases:
  - Precision Time Protocol
  - PTP
  - PTPv1
  - PTPv2
  - gPTP
---
# Precision Time Protocol (PTP)  

Le Precision Time Protocol permet la [[Synchronisation|synchronisation]] des [[Horloge interne|horloges internes]] des appareils d'un réseau. 
## Hiérarchie PTP
![[Réseau/Notes/PTP/Images/PTP Diagrams-Hiérarchie PTP.drawio.svg|516]]
### Grandmaster Clock (GMC)

La [[Grandmaster Clock (GMC)]] est l'horloge de référence, au sommet de la hiérarchie PTP.  
Elle donne l'heure pour l'ensemble des horloges qui la suivent.  
Il ne peut y avoir qu'une [[Grandmaster Clock (GMC)|GMC]] par [[PTP Domain]].  
  
---
### Master Clock  
  
Le terme [[Master Clock]] désigne un appareil, ou le port de cet appareil, qui donne l'heure à un niveau hiérarchique PTP inférieur.  

---
### Follower Clock  

Le terme [[Follower Clock]] désigne un appareil, ou le port de cet appareil, qui se synchronise sur l'heure donnée par  sa [[Master Clock]].

---
### Ordinary Clock  

Le terme [[Ordinary Clock]] désigne un appareil doté d'une horloge interne qui se place à une extrémité du réseau. Il s'agit donc d'un [[Appareil terminal]] dont l'horloge peut devenir soit [[Master Clock]], soit [[Follower Clock]].  

---
### Élection de la GMC par le Best Master Clock Algorithm (BMCA)

Lorsqu'un appareil PTP est allumé, il commence par écouter les [[Announce (Message PTP)|messages Announce]] qui arrivent dans son port réseau.  

- Si aucun message ne lui parvient, le port devient un [[Master Clock|port Master]], et commence à émettre périodiquement ses propres [[Announce (Message PTP)|messages Announce]].  
- Si au contraire il reçoit des [[Announce (Message PTP)|messages Announce]], il utilise les informations qu'ils contiennent dans le [[Best Master Clock Algorithm (BMCA)]], afin de départager qui sera [[Master Clock|Master]] entre lui et l'émetteur du message.  

Le [[Best Master Clock Algorithm (BMCA)|BMCA]] regarde 6 critères pour définir quelle horloge aura la priorité pour devenir [[Grandmaster Clock (GMC)|Grandmaster Clock]] :  

1. **Priority 1** : Valeur configurable comprise en 0 et 255, plus la valeur est basse plus la priorité est haute.  
2. **Clock Class** : Valeur comprise entre 0 et 255, plus la valeur est basse plus la priorité est haute. 
    - **6** : Synchronisée sur une source externe primaire (GPS, Horloge Atomique).  
    - **7** : Était sur GPS mais a perdu le signal (mode Holdover).  
    - **248** : Valeur par défaut (Oscillateur interne libre).  
3. **Clock Accuracy** : Valeur hexadécimale comprise entre 00 et FF. La valeur est attribuée en fonction de la dérive de l'horloge par rapport au temps de référence. Plus la valeur est basse plus la priorité est haute.  
4. **Clock Variance** : Mesure la stabilité de l'oscillateur. Plus l'oscillateur est stable, plus la variance est basse.  
5. **Priority 2** : Valeur configurable comprise en 0 et 255, plus la valeur est basse plus la priorité est haute. Sert à départager deux machines identiques dont tous les paramètres précédents sont identiques.  
6. **Clock Identity** : **L'adresse MAC la plus basse gagne.**  

> [!ATTENTION] En PTPv1, les [[Announce (Message PTP)|messages Announce]] n'existent pas. Les informations nécessaires au [[Best Master Clock Algorithm (BMCA)|BMCA]] sont contenues dans les [[Sync (Message PTP)|message Sync]].

---
### États de synchronisation d'une horloge interne

Une horloge interne peut se trouver dans différents états : 

- Unlocked : L'horloge n'est pas [[Synchronisation|synchronisée]] à sa [[Master Clock]].
- Locked : L'horloge est [[Synchronisation|synchronisée]] à sa [[Master Clock]].
- Holdover : L'horloge a été synchronisée récemment mais ne l'est plus actuellement. Elle continue néanmoins de fonctionner temporairement jusqu'à dériver au-delà d'un point critique.
- Free running : L'horloge n'a jamais été [[Synchronisation|synchronisée]] ou est restée trop longtemps en holdover.  

---
## PTPv1 (IEEE 1588-2002)  

### Processus de synchronisation  

Pour qu'une [[Follower Clock]] soit [[Synchronisation|synchronisée]] sur l'heure de sa [[Master Clock]], un échange de [[Message PTP]] a lieu entre les deux horloges.

1. La [[Grandmaster Clock (GMC)|GMC]] émet à intervalles réguliers un [[Sync (Message PTP)|message Sync]], suivi d'un [[Follow_Up (Message PTP)|message Follow_Up]]. Dans le [[Follow_Up (Message PTP)|message Follow_Up]] est indiquée l'heure précise à laquelle le [[Sync (Message PTP)|message Sync]] est sorti du [[Master Clock|port Master]]. Cet heure est notée t1.  
2. La [[Follower Clock]] reçoit le [[Sync (Message PTP)|message Sync]] à l'instant nommé t2. Le [[Follow_Up (Message PTP)|message Follow_Up]] arrivant juste après lui permet de connaître t1.  
3. En parallèle, à intervalles réguliers, la [[Follower Clock]] envoie à sa [[Master Clock]] un [[Delay_Request (Message PTP)|message Delay_Req]] à l'instant nommé t3.  
4. La [[Master Clock]] reçoit le [[Delay_Request (Message PTP)|message Delay_Req]] à l'instant t4, et envoie en réponse un [[Delay_Response (Message PTP)|message Delay_Resp]] à la [[Follower Clock]] dans lequel est contenu l'heure exacte de t4.  

Cette procédure permet de calculer deux valeurs :  
1. **Le [[Path Delay]] (délai de transmission)** qui correspond au temps nécessaire à un message PTP pour voyager de la [[Master Clock]] à la [[Follower Clock]], et inversement.  
	   Il est calculé avec la formule  $PathDelay = \dfrac{(t2 - t1) + (t4 - t3)}{2}$   
	
2.  **L'Offset** qui correspond au décalage entre l'heure des deux horloges.  
	   Il est calculé avec la formule   $Offset = \dfrac{(t2 - t1) - (t4 - t3)}{2}$

![[PTP Diagrams-PTPv1.drawio.svg|850]]

---
## PTPv2 (IEEE 1588-2008)  

Le temps qui passe entre l'arrivée des [[Message PTP|messages PTP]] dans un switch et leur sortie (le [[Residence Time]]) n'est pas une valeur fixe. Or PTPv1 calcule le [[Path Delay]] comme si les messages traversaient un câble d'une longueur constante.  
Ce qui en résulte, c'est un phénomène appelé [[Jitter]] (ou [[Jitter|gigue]]) qui correspond à la variation du délai de propagation. Un [[Jitter]] d'une trop grande amplitude rend les [[Follower Clock|Follower Clocks]] instables. En audio, cette instabilité peut fausser la lecture des paquets de données dans les [[Buffer|buffers]]. Cela occasionne des pertes de paquets et donc une potentielle interruption du signal transporté.  
PTPv2 offre une solution permettant de corriger le [[Jitter]] provoqué par la présence de switches sur le chemin des [[Message PTP|messages PTP]].

---
### Types d'horloges supplémentaires  

#### Transparent Clock (TC)  

Une [[Transparent Clock]] est une horloge capable de mesurer et de communiquer le [[Residence Time]] des [[Trame Ethernet|trames]] qui la traversent. Il s'agit d'un mode de fonctionnement activable sur un switch pour un [[VLAN (Virtual Local Area Network)|VLAN]] ou un [[PTP Domain]] indiqué.  
Lorsqu'un [[Message PTP|message PTP]] traverse une [[Transparent Clock]], une partie de la [[Trame Ethernet|trame]] (le [[Correction Field]]) est modifiée. L'horloge y indique le [[Residence Time|temps de résidence]] du paquet au moment exact où il quitte le port de sortie vers l'horloge de destination.  
Ainsi, la [[Follower Clock]] connaît le temps exact qu'un [[Message PTP|message PTP]] a passé dans les switches avant de lui parvenir, et peut donc le soustraire avant de calculer le [[Path Delay]] et l'[[Offset]].  
En résulte un [[Path Delay]] fixe qui correspond exactement au temps de trajet à travers les [[Segment|liens]] physiques.  

---
#### Boundary Clock (BC)

Une [[Boundary Clock]] est une horloge qui agit comme relai de la [[Grandmaster Clock (GMC)|GMC]]. Il s'agit d'un mode de fonctionnement activable sur un switch pour un [[VLAN (Virtual Local Area Network)|VLAN]] ou un [[PTP Domain]] indiqué.  
Une [[Boundary Clock]] [[Synchronisation|synchronise]] son horloge interne sur l'heure de la [[Grandmaster Clock (GMC)|GMC]].  
Ce type d'horloge est donc à la fois [[Follower Clock]] de la [[Grandmaster Clock (GMC)|GMC]] et [[Master Clock]] des horloges qui sont branchées en aval.  
Elle génère ses propres [[Sync (Message PTP)|messages Sync]] vers ses [[Follower Clock|Follower Clocks]].  
Puisque les [[Message PTP|messages PTP]] ne traversent pas une [[Boundary Clock]], le [[Residence Time|temps de résidence]] n'entre pas en compte dans les calculs de délai de propagation. 
En résulte un [[Path Delay]] fixe qui correspond exactement au temps de trajet à travers chacun des [[Segment|liens]] physiques.  

---
### Mécanismes de mesure du délai  

#### End-to-End (E2E)  

En mode [[End-to-End (E2E)|End-to-End]] (Bout-à-Bout) :  

- Le [[Path Delay]] est calculé d'un bout à l'autre du chemin qui sépare une [[Follower Clock]] de sa [[Master Clock]] ([[Grandmaster Clock (GMC)|GMC]] ou [[Boundary Clock]] la plus proche).  
- Le dialogue a lieu en échangeant les messages [[Delay_Request (Message PTP)|Delay_Req]] et [[Delay_Response (Message PTP)|Delay_Resp]].  
- Les [[Transparent Clock|Transparent Clocks]] sur le chemin indiquent leur [[Residence Time]] dans le [[Correction Field]], les switches non-PTP ajoutent du [[Jitter]].  

> [!NOTE] Il s'agit du mode de fonctionnement unique de PTPv1.

---
#### Peer-to-Peer (P2P)  

En mode [[Peer-to-Peer (P2P)|Peer-to-Peer]] (Pair-à-Pair) :  

- Le [[Path Delay]] est calculé en permanence pour chaque [[Segment|segment]] de manière indépendante, grâce au dialogue entre les [[Port PTP|ports PTP]] à chaque extrémité des [[Segment|segments]], quel que soit leur statut ([[Master Clock|Master]], [[Follower Clock|Follower]] où [[Listening (PTP)|Listening]]). On parle alors de [[Peer Delay]].  
- Le dialogue a lieu en échangeant des messages [[Pdelay_Request (Message PTP)|Pdelay_Req]], [[Pdelay_Response (Message PTP)|Pdelay_Resp]] ainsi que [[Pdelay_Response_Follow_Up (Message PTP)|Pdelay_Response Follow_Up]].
- Les [[Transparent Clock|Transparent Clocks]] sur le chemin indiquent leur Residence Time **ainsi que le [[Peer Delay]] qu'elles ont préalablement calculé avec leur voisin précédent.**
- Ce mode impose que tous les équipements soit compatibles [[Peer-to-Peer (P2P)|P2P]]. 

---
### Méthodes d'horodatage  

Lorsqu'une horloge reçoit un [[Sync (Message PTP)|message Sync]] ou un [[Pdelay_Response (Message PTP)|message Pdelay_Resp]] (uniquement en [[Peer-to-Peer (P2P)|P2P]]), elle a besoin de connaître l'heure exacte à laquelle le message en question a été envoyé.  
Pour que cette valeur soit communiquée, il existe deux méthodes d'horodatage.  
La méthode d'horodatage des [[Ordinary Clock|Ordinary Clocks]] dépend du constructeur du matériel.  
Les horloges sont toutes capables de lire les messages envoyés selon les deux méthodes.  

#### Two-Step Method  

Avec la [[Two-Step Method (PTP)|Two-Step Method]] :  

- Lorsqu'un [[Sync (Message PTP)|message Sync]] ou [[Pdelay_Response (Message PTP)|Pdelay_Resp]] est envoyé, l'horloge note dans sa mémoire l'heure exacte à laquelle le message quitte le port de sortie.  
- Un [[Follow_Up (Message PTP)|message Follow_Up]] ou [[Pdelay_Response_Follow_Up (Message PTP)|Pdelay_Response Follow_Up]] qui contient l'heure mise en mémoire est généré immédiatement après puis envoyé à son tour.  
- Mode compatible avec tout matériel.  

> [!NOTE] Il s'agit de la méthode d'horodatage unique de PTPv1.
#### One-Step Method  

Avec la [[One-Step Method (PTP)|One-Step Method]] :  

- L'horloge est capable d'inscrire l'heure exacte de départ directement à l'intérieur du [[Sync (Message PTP)|message Sync]] ou [[Pdelay_Response (Message PTP)|Pdelay_Resp]] au moment où il quitte le port de sortie.  
- Il n'y a pas besoin de [[Follow_Up (Message PTP)|message Follow_Up]] ou [[Pdelay_Response_Follow_Up (Message PTP)|Pdelay_Response Follow_Up]]. Cela diminue la charge du processeur des horloges.  
- Mode nécessitant un matériel capable d'horodatage à la transition entre la couche 2 et la couche 1.  

---
### Diffusion des messages Sync


#### E2E Transparent Clocks  

**Dans un réseau [[End-to-End (E2E)|End-to-End]] avec des [[Transparent Clock|Transparent Clocks]] :**  

- La [[Grandmaster Clock (GMC)|GMC]] envoie à intervalles réguliers des [[Sync (Message PTP)|messages Sync]] suivis d'un [[Follow_Up (Message PTP)|message Follow_Up]].
- Les [[Sync (Message PTP)|messages Sync]] traversent les [[Transparent Clock|Transparent Clocks]] qui indiquent leur [[Residence Time]] dans le [[Correction Field]].
- Les [[Follower Clock|Follower Clocks]] reçoivent les messages et sont capables d'éliminer le [[Jitter]] en soustrayant le [[Residence Time]] de chaque [[Transparent Clock]].
![[PTP Diagrams-E2E TC SYNC.drawio.svg|850]]

---
#### P2P Transparent Clocks  

**Dans un Réseau [[Peer-to-Peer (P2P)|Peer-to-Peer]] avec des [[Transparent Clock|Transparent Clocks]] :**  

- La [[Grandmaster Clock (GMC)|GMC]] envoie à intervalles réguliers des [[Sync (Message PTP)|messages Sync]] suivis d'un [[Follow_Up (Message PTP)|message Follow_Up]].
- Les [[Sync (Message PTP)|messages Sync]] traversent les [[Transparent Clock|Transparent Clocks]] qui indiquent leur [[Residence Time]] ==ainsi que le [[Peer Delay]] de leur port [[Follower Clock|Follower]]== dans le [[Correction Field]].
- Les [[Follower Clock|Follower Clocks]] reçoivent les messages et sont capables d'éliminer le [[Jitter]] en soustrayant le [[Residence Time]] **ainsi que le [[Peer Delay]]** de chaque [[Transparent Clock]].
![[PTP Diagrams-P2P TC SYNC.drawio.svg|850]]

---
#### E2E ou P2P Boundary Clocks  

**Dans un réseau [[End-to-End (E2E)|End-to-End]] ou [[Peer-to-Peer (P2P)|Peer-to-Peer]] avec des [[Boundary Clock|Boundary Clocks]]:**  

- La [[Grandmaster Clock (GMC)|GMC]] ainsi que chaque [[Boundary Clock]] envoient à intervalles réguliers des [[Sync (Message PTP)|messages Sync]] suivis d'un [[Follow_Up (Message PTP)|message Follow_Up]].
- Les [[Follower Clock|Follower Clocks]] (dont les ports [[Follower Clock|Follower]] des [[Boundary Clock|Boundary Clocks]]) reçoivent les messages sans [[Jitter]].

![[PTP Diagrams-P2P & E2E BC SYNC.drawio.svg|850]]

---

### Échanges des messages de délai

#### E2E Transparent Clocks  

**Dans un réseau [[End-to-End (E2E)|End-to-End]] avec des [[Transparent Clock|Transparent Clocks]] :**  

- La [[Follower Clock|Follower Clock]] envoie à sa [[Master Clock]] des [[Delay_Request (Message PTP)|Delay_Req]] à intervalles réguliers.
- Les [[Delay_Request (Message PTP)|message Delay_Req]] traversent les [[Transparent Clock|Transparent Clocks]] qui indiquent leur [[Residence Time]] dans le [[Correction Field]].
- La [[Master Clock]] reçoit les [[Delay_Request (Message PTP)|messages Delay_Req]] et répond avec des [[Delay_Response (Message PTP)|messages Delay_Resp]].
- Les messages [[Delay_Response (Message PTP)|Delay_Resp]] traversent les [[Transparent Clock|Transparent Clocks]] qui indiquent leur [[Residence Time]].
- La [[Follower Clock]] reçoit les [[Delay_Response (Message PTP)|messages Delay_Resp]] et est capable d'éliminer le [[Jitter]] en soustrayant le [[Residence Time]] de chaque [[Transparent Clock]].

![[PTP Diagrams-E2E TC DELAY.drawio.svg|850]]

---

#### E2E Boundary Clocks

**Dans un réseau [[End-to-End (E2E)|End-to-End]] avec des [[Boundary Clock|Boundary Clocks]] :**  

- Les [[Follower Clock|Follower Clocks]] (incluant les ports [[Follower Clock|Follower]] des [[Boundary Clock|Boundary Clocks]]) envoient à leur [[Master Clock]] des [[Delay_Request (Message PTP)|Delay_Req]] à intervalles réguliers.
- Les [[Master Clock|Master Clocks]] reçoivent les [[Delay_Request (Message PTP)|messages Delay_Req]] et répondent avec des [[Delay_Response (Message PTP)|messages Delay_Resp]].
- Les [[Follower Clock|Follower Clocks]] reçoivent les [[Delay_Response (Message PTP)|messages Delay_Resp]] sans [[Jitter]].

![[PTP Diagrams-E2E BC DELAY.drawio.svg|850]]

---

#### P2P Transparent Clocks ou Boundary Clocks

**Dans un réseau [[Peer-to-Peer (P2P)|Peer-to-Peer]] avec des [[Transparent Clock|Transparent Clocks]] ou des [[Boundary Clock|Boundary Clocks]] :**  

- Tous les ports [[Follower Clock|Follower]] comme les ports [[Master Clock|Master]] envoient à leur voisin direct des [[PDelay_Request (Message PTP)|messages Pdelay_Req]] à intervalles réguliers.
- Chaque port recevant un [[PDelay_Request (Message PTP)|message Pdelay_Req]] répond avec un [[Pdelay_Response (Message PTP)|message Pdelay_Resp]] suivi d'un [[Pdelay_Response_Follow_Up (Message PTP)|message Pdelay_Resp_Follow_Up]].
- Chaque port recevant cette réponse peut calculer le Path Delay pour chaque [[Segment|segment]] du réseau.

> [!NOTE]
> - Le message Pdelay_Resp_Follow_Up n'est envoyé qu'en mode Two-Step.
> - Les Transparent Clocks utilisent le délai mesuré pour l'ajouter au Correction Field des messages Sync qui les traversent.
> - Les Boundary Clocks utilisent le délai mesuré pour calculer leur propre décalage par rapport à leur Master et ajuster leur horloge interne.


![[PTP Diagrams-P2P TC DELAY.drawio.svg|850]]

---
![[PTP Diagrams-P2P BC DELAY.drawio.svg|850]]

---






NTP (Network Time Protocol) : précis à moins de 10 ms (mesuré en µs)
- Va chercher l'information temporelle sur un serveur NTP

PTP : précis à moins de 1 microseconde (mesuré en nanos)
- PTP Grandmaster envoie l'information temporelle aux horloges clientes

## Synchro avec des intermédiaires en Transparent clock EN MODE END TO END

Message de syncho avec follow up (t1)
Entre dans switch TC  
residence time  
sync envoyé
follow up envoyé (t1 + residence time + path delay)

Entre dans un deuxième switch TC  
residence time  
sync envoyé
follow up envoyé (t1 + somme des residence time + somme des path delays)

arrivé dans OC

En traversant des switchs, le temps de résidence varie, donc le path delay varie 


Les delay de chaque OC sera différent

Chaque OC génère ses propres delay requests
pour que la GMC sache à qui envoyer sa réponse, les clock ont un ID unique pour les différencier
Donc GMC doit générer autant de delay responses qu'il y a de messages de delay request et plus le nombre d'OC augmente plus le nombre de réponses à envoyer est important, risque de saturation de [[Master Clock|GMC]]

## Synchro avec des intermédiaires en Transparent clock EN MODE PEER TO PEER

Sync message comme en [[End-to-End (E2E)|E2E]] 

=/= tous les Peers envoient [[Pdelay_Request (Message PTP)]] à leur voisin

Chaque Peer connait son [[Path Delay]] et peut donc l'indiquer dans le correction field du message qu'il envoie  

Dans ce cas Offset = t2-t1

Sync msg avec BOUNDAR CLOCK  [[End-to-End (E2E)|E2E]] 
GMC et [[Boundary Clock]] envoient messages sync simultanément

Delay request en [[End-to-End (E2E)|E2E]]
Tous les ports slave envoient une demande de delai à leur master 

 
Transparent Clock : un domain PTP par VLAN  
Boundary Clock : un domain PTP peut distribuer plusieurs VLANs

Inconvenient BC : cumulative error 

Transparent clock permet une convergence plus rapide en [[Peer-to-Peer (P2P)|P2P]] 









Grandmaster clock 
Ordinary clocks celles qui doivent être synchronisées 

PTP Epoch : 1 janvier 1970 00:00

Versions de PTP : 
PTPv1 = IEEE 1588v1 (2002)
PTPv2 = IEEE 1588v2 (2008, MàJ en 2019)
gPTP = IEEE 802.1AS profil basé sur PTPv2, impose [[Peer-to-Peer (P2P)|P2P]] et interdit [[Transparent Clock]] 


1 seul GMC par [[PTP Domain]] 
[[Best Master Clock Algorithm (BMCA)|BMCA]] : 
- Priority 1 : Variable configurable administrativement de 0 à 255, plus basse est la valeur supérieure est la priorité
- Clock Class : valeur définie par plusieurs données de à à 255, valeur par défaut 248, si connectée à une source GPS value = 6
- Précision : priorité supérieur à la valeur la plus basse
- Variance : mesure de la stabilité d'une clock
- Priority 2 : Variable configurable administrativement de 0 à 255, plus basse est la valeur supérieure est la priorité
- Identité : 8 octets mac address



---
---
---