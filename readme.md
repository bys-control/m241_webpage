##Desarrollo

Instalar `http-server` desde npm `npm install -G http-server`

Luego ejecutar en el raíz del proyecto: `http-server . -P http://PLC_IP`

Donde `PLC_IP` es la IP que tiene el PLC. Todas las rutas no encontradas en el proyecto son redireccionadas al PLC para que este responda.

## Rutas disponibles
Mirando dentro del firmware, encontré que están mencionadas las siguientes rutas (sirven de base para rastrear en el código):
```
/plcExchange/getDataList/
/plcExchange/load
/plcExchange/remping
/plcExchange/command/start
/plcExchange/command/stop
/plcExchange/command/ResetPLCStat
/plcExchange/command/ResetEthStat
/plcExchange/command/ResetSerStat
/rest/diagnostic/getioscannerdata
/rest/diagnostic/geteipioscannerdata
*/
*/index.htm
/usr/web/
/usr/Syslog/
/usr/Eip/
/usr/App/Application.map
/usr/App/
/plcExchange/
/ram0/
/sys/Web/images/
/plcExchange/getValues/
/plcExchange/buildList
/plcExchange/save/
/authentication/login/
/authentication/logout/
/plcExchange/setValues/
```