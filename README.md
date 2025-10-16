# 📊 Sistema de Documentos SECPLAN - UFG

Sistema integrado com Google Sheets para gerenciamento de documentos da Secretaria de Planejamento, Avaliação e Informações Institucionais da UFG.

## 🏗️ Estrutura do Projeto

```
repositorio_documentos/
├── frontend/          # Aplicação React (Frontend)
│   ├── src/           # Código fonte React
│   ├── public/        # Arquivos públicos
│   ├── package.json   # Dependências do frontend
│   └── ...
├── backend/           # Servidor Node.js (Backend)
│   ├── src/           # Código fonte do servidor
│   ├── package.json   # Dependências do backend
│   └── .env           # Configurações (API Key, etc.)
└── README.md          # Este arquivo
```

## 🚀 Como Executar

### **1. Backend (Servidor)**
```bash
cd backend
npm install
npm run dev
```
- Servidor rodará em: http://localhost:3001
- API disponível em: http://localhost:3001/api

### **2. Frontend (Aplicação)**
```bash
cd frontend
npm install
npm run dev
```
- Aplicação rodará em: http://localhost:5173

## 🔗 Integração com Google Sheets

### **Planilha Configurada:**
- **URL:** https://docs.google.com/spreadsheets/d/16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw/edit?usp=sharing
- **Aba:** Lista
- **Sincronização:** Automática a cada 5 minutos

### **Funcionalidades:**
- ✅ **Sincronização automática** com Google Sheets
- ✅ **Sincronização manual** com botão "Sincronizar"
- ✅ **Status em tempo real** (Online/Offline)
- ✅ **Fallback** para dados locais se API falhar
- ✅ **Interface visual** para monitoramento

## 📊 Como Usar

### **1. Adicionar Documentos:**
- Abra a planilha no Google Sheets
- Adicione nova linha na aba "Lista"
- Aguarde 5 minutos OU clique em "Sincronizar"
- Documento aparece automaticamente no sistema

### **2. Editar Documentos:**
- Edite diretamente na planilha
- Mudanças aparecem no sistema automaticamente
- Use "Sincronizar" para atualização imediata

### **3. Monitorar Status:**
- Veja status "Online/Offline" no header
- Verifique "Última sync" para saber quando foi atualizado
- Use botão "Sincronizar" para forçar atualização

## 🔧 Configuração

### **API Key do Google:**
- Já configurada: `AIzaSyADQAVJ0SnvTI1Syl-0Bzb_2Z_JbsA2yWU`
- Planilha já conectada: `16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw`

### **Variáveis de Ambiente:**
Arquivo `backend/.env`:
```env
GOOGLE_SHEETS_API_KEY=AIzaSyADQAVJ0SnvTI1Syl-0Bzb_2Z_JbsA2yWU
GOOGLE_SHEETS_SPREADSHEET_ID=16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw
GOOGLE_SHEETS_RANGE=Lista!A1:AE1000
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## 🎯 Teste Rápido

1. **Execute o backend:** `cd backend && npm run dev`
2. **Execute o frontend:** `cd frontend && npm run dev`
3. **Acesse:** http://localhost:5173
4. **Verifique:** SyncStatus mostra "Online"
5. **Teste:** Adicione documento na planilha e veja aparecer no sistema!

## 📈 Status Atual

- ✅ **Backend:** Funcionando (420 documentos sincronizados)
- ✅ **Frontend:** Reorganizado e pronto
- ✅ **Integração:** Google Sheets conectada
- ✅ **Sincronização:** Automática funcionando

## 🎉 Pronto!

Agora você pode:
- ✅ Escrever na planilha e ver os dados aparecerem automaticamente
- ✅ Editar documentos diretamente no Google Sheets
- ✅ Monitorar o status da sincronização
- ✅ Ter sincronização em tempo real

**Sua integração com Google Sheets está funcionando! 🚀**