@echo off
echo DIAGNOSTICO DE BACKEND
echo ======================
echo.
echo Intentando iniciar backend con C:\Program Files\nodejs\node.exe...
echo.

"C:\Program Files\nodejs\node.exe" index.js > backend_log.txt 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] El backend fallo con codigo %ERRORLEVEL%
    echo Revisa backend_log.txt para mas detalles.
) else (
    echo [OK] El backend parece haber terminado correctamente (esto es sospechoso si deberia ser un servidor).
)

type backend_log.txt
pause
