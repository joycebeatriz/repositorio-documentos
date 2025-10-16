@echo off
echo ========================================
echo   INICIANDO FRONTEND
echo ========================================
echo.

echo Verificando se o backend está rodando...
timeout 2 > nul

echo Iniciando frontend...
cd frontend
npm run dev

pause
