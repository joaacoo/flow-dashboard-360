@echo off
echo ===================================================
echo   INICIANDO DASHBOARD FLOW 360 (MODO SEGURO)
echo ===================================================
echo.
echo Detectando instalacion de Node.js...
echo.

if exist "C:\Program Files\nodejs\node.exe" (
    echo [OK] Node.js encontrado en C:\Program Files\nodejs\node.exe
    "C:\Program Files\nodejs\node.exe" start.js
) else (
    echo [ERROR] No se encontro Node.js en la ruta estandar.
    echo Intentando con el comando del sistema...
    node start.js
)

pause
