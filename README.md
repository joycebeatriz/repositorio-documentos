# 📊 Sistema de Documentos SECPLAN - UFG

Sistema integrado com Google Sheets para gerenciamento de documentos da Secretaria de Planejamento, Avaliação e Informações Institucionais da UFG.

## 🏗️ Estrutura do Projeto (Frontend Only)

```
repositorio_documentos/
├── frontend/                    # Aplicação React (Frontend Only)
│   ├── src/                    # Código fonte React
│   │   ├── config/            # Configurações do Google Sheets
│   │   ├── hooks/              # Hooks personalizados
│   │   ├── components/         # Componentes React
│   │   └── pages/             # Páginas da aplicação
│   ├── public/                 # Arquivos públicos
│   ├── package.json           # Dependências do frontend
│   └── ...
├── teste-google-sheets.html   # Arquivo de teste da integração
├── iniciar-frontend.bat       # Script para iniciar o frontend
├── diagnosticar-sincronizacao.bat # Script de diagnóstico
└── README.md                  # Este arquivo
```

## 🚀 Como Executar (Frontend Only)

### **Executar Aplicação:**
```bash
cd frontend
npm install
npm run dev
```
- Aplicação rodará em: http://localhost:5173
- **Sem necessidade de backend!**

### **Scripts Automatizados:**
- **Windows:** Execute `iniciar-frontend.bat`
- **Diagnóstico:** Execute `diagnosticar-sincronizacao.bat`

## 🔗 Integração Direta com Google Sheets

### **Como Funciona:**
- ✅ **Acesso direto** à API pública do Google Sheets
- ✅ **Sem backend** - funciona apenas com frontend
- ✅ **Sincronização automática** a cada 30 segundos
- ✅ **Cache inteligente** para melhor performance
- ✅ **Interface idêntica** ao sistema anterior

### **Planilha Configurada:**
- **URL:** https://docs.google.com/spreadsheets/d/16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw/edit?usp=sharing
- **Aba:** Lista
- **Sincronização:** Automática e manual

### **Funcionalidades:**
- ✅ **Sincronização automática** com Google Sheets
- ✅ **Sincronização manual** com botão "Sincronizar"
- ✅ **Status em tempo real** (Online/Offline)
- ✅ **Interface visual** para monitoramento
- ✅ **Busca e filtros** funcionando normalmente
- ✅ **Estatísticas e gráficos** atualizados

## 📊 Como Usar

### **1. Adicionar Documentos:**
- Abra a planilha no Google Sheets
- Adicione nova linha na aba "Lista"
- Aguarde sincronização automática OU clique em "Sincronizar"
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

### **Configuração Centralizada:**
Arquivo `frontend/src/config/googleSheets.ts`:
```typescript
export const GOOGLE_SHEETS_CONFIG = {
  API_KEY: 'AIzaSyADQAVJ0SnvTI1Syl-0Bzb_2Z_JbsA2yWU',
  SPREADSHEET_ID: '16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw',
  RANGE: 'Lista!A1:AE1000'
};
```

### **API Key do Google:**
- Já configurada: `AIzaSyADQAVJ0SnvTI1Syl-0Bzb_2Z_JbsA2yWU`
- Planilha já conectada: `16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw`

## 🎯 Teste Rápido

1. **Execute o frontend:** `cd frontend && npm run dev`
2. **Acesse:** http://localhost:5173
3. **Verifique:** SyncStatus mostra "Online"
4. **Teste:** Adicione documento na planilha e veja aparecer no sistema!
5. **Arquivo de teste:** Abra `teste-google-sheets.html` no navegador

## 📈 Vantagens da Nova Arquitetura

- ✅ **Mais simples:** Sem necessidade de backend
- ✅ **Mais rápido:** Acesso direto à planilha
- ✅ **Mais confiável:** Menos pontos de falha
- ✅ **Fácil deploy:** Pode ser hospedado em qualquer serviço estático
- ✅ **Menos recursos:** Não precisa de servidor Node.js

## 🎉 Pronto!

Agora você pode:
- ✅ Escrever na planilha e ver os dados aparecerem automaticamente
- ✅ Editar documentos diretamente no Google Sheets
- ✅ Monitorar o status da sincronização
- ✅ Ter sincronização em tempo real
- ✅ **Usar apenas o frontend - sem backend!**

**Sua integração com Google Sheets está funcionando de forma mais simples! 🚀**