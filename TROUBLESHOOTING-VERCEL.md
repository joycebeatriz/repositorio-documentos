# 🔧 Guia de Solução de Problemas - Deploy Vercel

## 🚨 Problema: Dados não aparecem no Vercel/outros dispositivos

### ✅ Soluções Implementadas:

1. **Configuração com Variáveis de Ambiente**
   - Sistema agora usa `import.meta.env.VITE_*`
   - Fallback para valores padrão se não configurado
   - Validação automática de configurações

2. **Tratamento de Erros Melhorado**
   - Mensagens específicas para cada tipo de erro
   - Logs detalhados no console
   - Timeout de 30 segundos para evitar travamentos

3. **Headers HTTP Otimizados**
   - Headers corretos para requisições
   - Suporte a CORS melhorado

## 🔍 Como Diagnosticar:

### 1. **Verificar Console do Navegador**
Abra F12 > Console e procure por:
- ✅ `🔄 Buscando dados diretamente do Google Sheets...`
- ✅ `📍 Configurações:` (deve mostrar todas configuradas)
- ❌ Erros em vermelho

### 2. **Verificar Configurações**
No console, deve aparecer:
```
📍 Configurações: {
  API_KEY: "✅ Configurada",
  SPREADSHEET_ID: "✅ Configurada", 
  RANGE: "Lista!A1:AE1000"
}
```

### 3. **Verificar Resposta HTTP**
Deve aparecer:
```
📡 Resposta HTTP: {
  status: 200,
  statusText: "OK",
  ok: true
}
```

## 🛠️ Configuração no Vercel:

### 1. **Variáveis de Ambiente**
No dashboard do Vercel:
- Settings > Environment Variables
- Adicionar:
  - `VITE_GOOGLE_SHEETS_API_KEY` = `AIzaSyADQAVJ0SnvTI1Syl-0Bzb_2Z_JbsA2yWU`
  - `VITE_GOOGLE_SHEETS_SPREADSHEET_ID` = `16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw`
  - `VITE_GOOGLE_SHEETS_RANGE` = `Lista!A1:AE1000`

### 2. **Configuração da API Key**
No Google Cloud Console:
- APIs e serviços > Credenciais
- Editar sua API Key
- Restrições de aplicativos:
  - Adicionar: `https://seuapp.vercel.app`
  - Adicionar: `https://*.vercel.app` (para previews)

### 3. **Configuração da Planilha**
No Google Sheets:
- Compartilhar > Qualquer pessoa com o link
- Permissão: Leitor
- Verificar se a aba "Lista" existe

## 🚨 Erros Comuns e Soluções:

### **Erro 403: API Key inválida**
- ✅ Verificar se API Key está correta
- ✅ Verificar se planilha está pública
- ✅ Verificar restrições da API Key

### **Erro 404: Planilha não encontrada**
- ✅ Verificar ID da planilha
- ✅ Verificar se planilha existe

### **Erro 429: Limite excedido**
- ✅ Aguardar alguns minutos
- ✅ Verificar se não há muitas requisições simultâneas

### **CORS Error**
- ✅ Verificar configuração da API Key
- ✅ Verificar se domínio está nas restrições

## 🧪 Teste Local vs Produção:

### **Teste Local:**
```bash
cd frontend
npm run dev
# Acesse: http://localhost:8080
```

### **Teste Produção:**
1. Configure variáveis de ambiente no Vercel
2. Faça deploy
3. Acesse sua URL do Vercel
4. Verifique console do navegador

## 📋 Checklist de Verificação:

- [ ] API Key configurada no Vercel
- [ ] ID da planilha configurado no Vercel
- [ ] Planilha está pública para leitura
- [ ] API Key tem restrições corretas
- [ ] Deploy foi feito após configurar variáveis
- [ ] Console do navegador não mostra erros
- [ ] Status mostra "Online" no header

## 🔗 Links Úteis:

- [Google Cloud Console](https://console.cloud.google.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)

## 📞 Suporte:

Se ainda não funcionar:
1. Verifique todos os itens do checklist
2. Copie os logs do console do navegador
3. Verifique se as variáveis de ambiente estão configuradas no Vercel
4. Teste com o arquivo `teste-google-sheets.html` localmente
