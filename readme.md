##Desarrollo

Instalar `http-server` desde npm `npm install -G http-server`

Luego ejecutar en el raíz del proyecto: `http-server . -P http://PLC_IP`

Donde `PLC_IP` es la IP que tiene el PLC. Todas las rutas no encontradas en el proyecto son redireccionadas al PLC para que este responda.