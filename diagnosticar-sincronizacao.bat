@echo off
echo ========================================
echo   DIAGNOSTICO DA SINCRONIZACAO
echo ========================================
echo.

echo 🔍 Verificando configuração...
echo.

REM Verificar se o arquivo .env existe
if exist "backend\.env" (
    echo ✅ Arquivo .env encontrado
    echo.
    echo 📋 Conteúdo do arquivo .env:
    type backend\.env
    echo.
) else (
    echo ❌ Arquivo .env NÃO encontrado
    echo.
    echo 🔧 Criando arquivo .env com configurações padrão...
    echo.
    
    REM Criar arquivo .env com as configurações do teste
    echo # Google Sheets Configuration > backend\.env
    echo GOOGLE_SHEETS_API_KEY=AIzaSyADQAVJ0SnvTI1Syl-0Bzb_2Z_JbsA2yWU >> backend\.env
    echo GOOGLE_SHEETS_SPREADSHEET_ID=16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw >> backend\.env
    echo GOOGLE_SHEETS_RANGE=Lista!A1:AE1000 >> backend\.env
    echo. >> backend\.env
    echo # Server Configuration >> backend\.env
    echo PORT=3001 >> backend\.env
    echo NODE_ENV=development >> backend\.env
    echo. >> backend\.env
    echo # CORS Configuration >> backend\.env
    echo FRONTEND_URL=http://localhost:5173 >> backend\.env
    echo. >> backend\.env
    echo # Logging >> backend\.env
    echo LOG_LEVEL=info >> backend\.env
    
    echo ✅ Arquivo .env criado com sucesso!
    echo.
)

echo 🚀 Verificando se o backend está rodando...
echo.

REM Tentar fazer uma requisição para o status da API
echo Testando conexão com http://localhost:3001/api/status...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/status' -TimeoutSec 5; Write-Host '✅ Backend está rodando!'; Write-Host 'Status:' $response.StatusCode; Write-Host 'Resposta:' $response.Content } catch { Write-Host '❌ Backend não está rodando ou não responde'; Write-Host 'Erro:' $_.Exception.Message }"

echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. Se o backend não estiver rodando:
echo    cd backend
echo    npm install
echo    npm run dev
echo.
echo 2. Se o backend estiver rodando mas com erro:
echo    - Verifique os logs no terminal do backend
echo    - Verifique se a API Key do Google está válida
echo.
echo 3. Teste manual da API:
echo    curl http://localhost:3001/api/status
echo    curl http://localhost:3001/api/documents
echo.
echo 4. No frontend, verifique:
echo    - Console do navegador (F12) para erros
echo    - Se o componente SyncStatus aparece no header
echo    - Se o botão "Sync" funciona
echo.
pause
