# Frontend Only - Integração Direta com Google Sheets

Este projeto agora funciona **apenas com o frontend**, sem necessidade de backend. A integração é feita diretamente com a API pública do Google Sheets.

## ✅ Vantagens da Solução Frontend-Only

- **Sem necessidade de backend**: Não precisa rodar servidor Node.js
- **Mais simples**: Menos complexidade de infraestrutura
- **Mais rápido**: Acesso direto à planilha
- **Mais confiável**: Menos pontos de falha
- **Fácil deploy**: Pode ser hospedado em qualquer serviço estático

## 🔧 Como Funciona

### 1. Acesso Direto à API do Google Sheets
- Usa a API pública do Google Sheets (v4)
- Apenas leitura - não modifica dados
- Usa API Key pública (não requer autenticação OAuth)

### 2. Configuração Centralizada
- Arquivo: `frontend/src/config/googleSheets.ts`
- Contém todas as configurações da planilha
- Fácil de modificar quando necessário

### 3. Hook Personalizado
- `useDirectGoogleSheets`: Hook que gerencia a conexão
- Cache automático dos dados
- Sincronização periódica
- Tratamento de erros robusto

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
cd frontend
npm install
```

### 2. Configurar Planilha (se necessário)
Edite o arquivo `frontend/src/config/googleSheets.ts`:
```typescript
export const GOOGLE_SHEETS_CONFIG = {
  API_KEY: 'sua-api-key',
  SPREADSHEET_ID: 'id-da-sua-planilha',
  RANGE: 'Aba!A1:Z1000'
};
```

### 3. Executar o Frontend
```bash
npm run dev
```

### 4. Acessar a Aplicação
- Abra: http://localhost:5173
- A aplicação carregará os dados diretamente da planilha

## 📊 Funcionalidades Mantidas

- ✅ Busca de documentos
- ✅ Filtros por setor, tipo, status
- ✅ Estatísticas e gráficos
- ✅ Sincronização automática
- ✅ Interface responsiva
- ✅ Todos os componentes existentes

## 🔄 Sincronização

- **Automática**: A cada 30 segundos verifica conexão
- **Manual**: Botão de sincronização disponível
- **Cache**: Dados ficam em cache para melhor performance
- **Offline**: Mostra status de conexão

## 🛠️ Estrutura dos Dados

A planilha deve ter as seguintes colunas (podem ter nomes diferentes):
- Status
- Código
- Tipo
- Número
- Título
- Epígrafe
- Assunto
- Órgão ou Unidade
- Setor Responsável
- Data (documento)
- Link de Acesso
- Nível de Acesso
- Local do Arquivo
- Observação
- Tipo (sigla)
- CodSIORG
- Órgão ou Unidade (sigla)

## 🚨 Solução de Problemas

### Erro de CORS
- A API do Google Sheets não tem problemas de CORS
- Se houver erro, verifique a API Key

### Dados não carregam
1. Verifique se a API Key está correta
2. Verifique se o ID da planilha está correto
3. Verifique se o range está correto
4. Verifique se a planilha está pública para leitura

### Performance lenta
- O cache reduz chamadas desnecessárias
- Dados são carregados apenas quando necessário
- Sincronização automática evita recarregamentos

## 📝 Notas Importantes

- **API Key**: Deve ser uma chave pública do Google Sheets
- **Planilha**: Deve estar configurada para acesso público (leitura)
- **Range**: Ajuste conforme o tamanho da sua planilha
- **Limite**: Google Sheets tem limite de 100 requests/100 segundos por usuário

## 🔗 Links Úteis

- [Google Sheets API v4](https://developers.google.com/sheets/api)
- [Criar API Key](https://console.developers.google.com/)
- [Documentação da API](https://developers.google.com/sheets/api/reference/rest)
