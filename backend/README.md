# Configuração da Integração com Google Sheets

## Pré-requisitos

1. **Conta Google** com acesso ao Google Sheets
2. **Google Cloud Console** configurado
3. **Planilha** criada no Google Sheets com os dados dos documentos

## Passo 1: Configurar Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Sheets API**
4. Vá em "Credenciais" e crie uma **Chave de API**
5. Baixe o arquivo JSON das credenciais

## Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_API_KEY=sua_api_key_aqui
GOOGLE_SHEETS_SPREADSHEET_ID=id_da_sua_planilha
GOOGLE_SHEETS_RANGE=A1:Z1000

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## Passo 3: Estrutura da Planilha

A planilha deve ter as seguintes colunas na primeira linha:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| id | status | codigo | tipo | numero | titulo | epigrafe | assunto | orgao | setor | setorResponsavel | dataDocumento | linkAcesso | nivelAcesso | localArquivo | observacao | tipoSigla | codSIORG | orgaoSigla | orgaoUnidade | orgaoUnidadeSigla |

## Passo 4: Instalar Dependências

```bash
cd backend
npm install
```

## Passo 5: Executar o Servidor

```bash
npm run dev
```

## Funcionalidades

- ✅ Sincronização automática com Google Sheets
- ✅ API REST para buscar dados
- ✅ Atualização em tempo real
- ✅ CORS configurado para frontend
- ✅ Logs detalhados

## Troubleshooting

### Erro de Permissão
- Verifique se a API Key tem permissão para acessar a planilha
- Certifique-se que a planilha está compartilhada publicamente (apenas leitura)

### Erro de CORS
- Verifique se o FRONTEND_URL está correto no .env
- Certifique-se que o frontend está rodando na porta 5173

### Dados não aparecem
- Verifique se o SPREADSHEET_ID está correto
- Confirme se o RANGE inclui todos os dados
- Verifique os logs do servidor para erros específicos
