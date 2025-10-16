@echo off
echo ========================================
echo   DIAGNOSTICO DA SINCRONIZACAO
echo   (FRONTEND ONLY - SEM BACKEND)
echo ========================================
echo.

echo 🔍 Verificando configuração do Google Sheets...
echo.

REM Verificar se o arquivo de configuração existe
if exist "frontend\src\config\googleSheets.ts" (
    echo ✅ Arquivo de configuração encontrado
    echo.
    echo 📋 Conteúdo do arquivo de configuração:
    type frontend\src\config\googleSheets.ts
    echo.
) else (
    echo ❌ Arquivo de configuração NÃO encontrado
    echo.
    echo 🔧 O arquivo frontend\src\config\googleSheets.ts deve existir
    echo.
)

echo 🚀 Testando conexão direta com Google Sheets...
echo.

REM Testar conexão com Google Sheets
echo Testando conexão com Google Sheets API...
powershell -Command "try { $url = 'https://sheets.googleapis.com/v4/spreadsheets/16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw/values/Lista!A1:AE10?key=AIzaSyADQAVJ0SnvTI1Syl-0Bzb_2Z_JbsA2yWU'; $response = Invoke-WebRequest -Uri $url -TimeoutSec 10; Write-Host '✅ Conexão com Google Sheets OK!'; Write-Host 'Status:' $response.StatusCode; Write-Host 'Dados recebidos:' $response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)) '...' } catch { Write-Host '❌ Erro na conexão com Google Sheets'; Write-Host 'Erro:' $_.Exception.Message }"

echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. Se a conexão com Google Sheets falhar:
echo    - Verifique se a API Key está válida
echo    - Verifique se a planilha está pública para leitura
echo    - Verifique se o ID da planilha está correto
echo.
echo 2. Para testar o frontend:
echo    cd frontend
echo    npm install
echo    npm run dev
echo.
echo 3. No navegador, verifique:
echo    - Console do navegador (F12) para erros
echo    - Se os dados carregam automaticamente
echo    - Se o componente SyncStatus funciona
echo.
echo 4. Arquivo de teste incluído:
echo    - Abra teste-google-sheets.html no navegador
echo    - Testa a conexão diretamente
echo.
pause
