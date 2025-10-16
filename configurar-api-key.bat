@echo off
echo ========================================
echo   CONFIGURACAO GOOGLE SHEETS API
echo ========================================
echo.

echo 1. Acesse: https://console.cloud.google.com/
echo 2. Crie um novo projeto ou selecione um existente
echo 3. Ative a Google Sheets API
echo 4. Vá em "Credenciais" e crie uma "Chave de API"
echo 5. Copie a chave gerada
echo.

set /p API_KEY="Digite sua API Key do Google: "

echo.
echo ✅ ID da planilha já configurado: 16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw
echo ✅ Aba configurada: Lista
echo.

echo Criando arquivo .env...

echo # Google Sheets Configuration > backend\.env
echo GOOGLE_SHEETS_API_KEY=%API_KEY% >> backend\.env
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

echo.
echo ✅ Arquivo .env criado com sucesso!
echo.
echo Próximos passos:
echo 1. cd backend
echo 2. npm install
echo 3. npm run dev
echo.
echo O servidor estará disponível em: http://localhost:3001
echo.
pause
