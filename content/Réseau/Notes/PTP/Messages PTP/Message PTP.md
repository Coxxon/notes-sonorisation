---
tags:
  - définition
  - statut/ébauche
aliases:
  - messages PTP
  - message PTP
  - message PTPv2
  - messages PTPv2
---
# Message PTP  

**Unité de base de la communication des appareils [[Precision Time Protocol (PTP)|PTP]].**  

Ils se divisent en deux catégories :  

- **Event Messages** : Requièrent un horodatage précis au moment exact où ils sortent ou entrées dans un [[Port PTP|ports PTP]]. 
	- [[Sync (Message PTP)|Sync]]
	- [[Delay_Request (Message PTP)|Delay_Req]]
	- [[PDelay_Request (Message PTP)|Pdelay_Req]]
	- [[Pdelay_Response (Message PTP)|Pdelay_Resp]]
- **General Messages** : Ne nécessitent pas d'horodatage à la volée.
	- [[Announce (Message PTP)|Announce]]
	- [[Follow_Up (Message PTP)|Follow_Up]]
	- [[Delay_Response (Message PTP)|Delay_Resp]]
	- [[Pdelay_Response_Follow_Up (Message PTP)|Pdelay_Resp_Follow_Up]]
	- Management
	- Signaling
