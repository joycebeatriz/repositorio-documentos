import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import cron from 'node-cron';

// Carregar variáveis de ambiente
dotenv.config();

// Configurações temporárias para teste (remover quando .env estiver configurado)
const TEMP_CONFIG = {
  GOOGLE_SHEETS_API_KEY: 'AIzaSyADQAVJ0SnvTI1Syl-0Bzb_2Z_JbsA2yWU',
  GOOGLE_SHEETS_SPREADSHEET_ID: '16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw',
  GOOGLE_SHEETS_RANGE: 'Lista!A1:AE1000',
  PORT: 3001,
  FRONTEND_URL: 'http://localhost:5173'
};

// Usar configurações do .env ou temporárias
const config = {
  GOOGLE_SHEETS_API_KEY: process.env.GOOGLE_SHEETS_API_KEY || TEMP_CONFIG.GOOGLE_SHEETS_API_KEY,
  GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || TEMP_CONFIG.GOOGLE_SHEETS_SPREADSHEET_ID,
  GOOGLE_SHEETS_RANGE: process.env.GOOGLE_SHEETS_RANGE || TEMP_CONFIG.GOOGLE_SHEETS_RANGE,
  PORT: process.env.PORT || TEMP_CONFIG.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL || TEMP_CONFIG.FRONTEND_URL
};

// Debug: Verificar configurações
console.log('🔧 Configurações carregadas:');
console.log('- API Key:', config.GOOGLE_SHEETS_API_KEY ? '✅ Configurada' : '❌ Não configurada');
console.log('- Spreadsheet ID:', config.GOOGLE_SHEETS_SPREADSHEET_ID ? '✅ Configurada' : '❌ Não configurada');
console.log('- Range:', config.GOOGLE_SHEETS_RANGE);
console.log('- Port:', config.PORT);

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors({
  origin: true, // Permitir todas as origens temporariamente
  credentials: true
}));
app.use(express.json());

// Configuração do Google Sheets
const sheets = google.sheets({ version: 'v4' });

// Cache para os dados
let documentsCache = [];
let documentsForStats = []; // Cache separado para estatísticas (documentos únicos)
let lastSyncTime = null;

// Função para buscar dados da planilha
async function fetchDocumentsFromSheets() {
  try {
    console.log('🔄 Sincronizando dados da planilha...');
    
    const response = await sheets.spreadsheets.values.get({
      key: config.GOOGLE_SHEETS_API_KEY,
      spreadsheetId: config.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: config.GOOGLE_SHEETS_RANGE,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('⚠️ Nenhum dado encontrado na planilha');
      return [];
    }

    // Primeira linha são os cabeçalhos
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Converter para objetos com mapeamento correto das colunas
    const documents = dataRows.map((row, index) => {
      const doc = {};
      
      // Mapear colunas da planilha para campos do sistema
      headers.forEach((header, colIndex) => {
        const value = row[colIndex] || '';
        
        // Mapear nomes das colunas para campos padronizados
        switch(header.toLowerCase()) {
          case 'status':
            doc.status = value;
            break;
          case 'código':
            doc.codigo = value;
            break;
          case 'tipo':
            doc.tipo = value;
            break;
          case 'número':
            doc.numero = value;
            break;
          case 'título':
            doc.titulo = value;
            break;
          case 'epígrafe':
            doc.epigrafe = value;
            break;
          case 'id':
            doc.id = value;
            break;
          case 'assunto':
            doc.assunto = value;
            break;
          case 'orgão ou unidade':
            doc.orgao = value;
            break;
          case 'setor responsável':
            doc.setorResponsavel = value;
            break;
          case 'data (documento)':
            doc.dataDocumento = value;
            break;
          case 'link de acesso':
            doc.linkAcesso = value;
            break;
          case 'nível de acesso':
            doc.nivelAcesso = value;
            break;
          case 'local do arquivo':
            doc.localArquivo = value;
            break;
          case 'observação':
            doc.observacao = value;
            break;
          case 'tipo (sigla)':
            doc.tipoSigla = value;
            break;
          case 'codsiorg':
            doc.codSIORG = value;
            break;
          case 'orgão ou unidade (sigla)':
            doc.orgaoSigla = value;
            break;
          default:
            // Manter outros campos como estão
            doc[header] = value;
        }
      });
      
       // Adicionar ID único se não existir
       if (!doc.id) {
         doc.id = `sheet_${index + 1}`;
       }
       
       // Criar array de setores para busca
       if (doc.setorResponsavel) {
         doc.setoresArray = doc.setorResponsavel.split(/[,;]/).map(s => s.trim()).filter(s => s);
       } else {
         doc.setoresArray = [];
       }
       
       return doc;
    });

    // Analisar estrutura dos setores para debug
    const setoresUnicos = new Set();
    documents.forEach(doc => {
      if (doc.setorResponsavel) {
        // Verificar se há múltiplos setores separados por vírgula ou ponto e vírgula
        const setores = doc.setorResponsavel.split(/[,;]/).map(s => s.trim()).filter(s => s);
        setores.forEach(setor => setoresUnicos.add(setor));
      }
    });
    
    console.log(`📊 Análise da estrutura:`);
    console.log(`- Total de linhas na planilha: ${documents.length}`);
    console.log(`- Total de setores únicos encontrados: ${setoresUnicos.size}`);
    console.log(`- Primeiros 5 setores:`, Array.from(setoresUnicos).slice(0, 5));
    
    console.log(`✅ ${documents.length} documentos sincronizados com sucesso`);
    return documents;

  } catch (error) {
    console.error('❌ Erro ao buscar dados da planilha:', error.message);
    return [];
  }
}

// Função para processar documentos únicos para estatísticas
function processDocumentsForStats(documents) {
  // Criar um mapa para remover duplicatas baseado no ID
  const uniqueDocsMap = new Map();
  
  documents.forEach(doc => {
    // Usar o ID como chave única
    if (!uniqueDocsMap.has(doc.id)) {
      uniqueDocsMap.set(doc.id, doc);
    }
  });
  
  // Converter de volta para array
  const uniqueDocs = Array.from(uniqueDocsMap.values());
  
  console.log(`📊 Estatísticas: ${uniqueDocs.length} documentos únicos (de ${documents.length} linhas)`);
  
  return uniqueDocs;
}

// Função para sincronizar dados
async function syncDocuments() {
  const documents = await fetchDocumentsFromSheets();
  if (documents.length > 0) {
    documentsCache = documents; // Para busca (mantém múltiplos setores)
    documentsForStats = processDocumentsForStats(documents); // Para estatísticas (documentos únicos)
    lastSyncTime = new Date();
    console.log(`📊 Cache atualizado: ${documents.length} documentos para busca, ${documentsForStats.length} únicos para estatísticas`);
  }
}

// Rota para buscar documentos
app.get('/api/documents', async (req, res) => {
  try {
    // Se não há cache ou é muito antigo, sincronizar
    if (documentsCache.length === 0 || 
        (lastSyncTime && (Date.now() - lastSyncTime.getTime()) > 5 * 60 * 1000)) {
      await syncDocuments();
    }

    res.json({
      success: true,
      data: documentsCache,
      lastSync: lastSyncTime,
      count: documentsCache.length
    });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Rota para forçar sincronização
app.post('/api/sync', async (req, res) => {
  try {
    await syncDocuments();
    res.json({
      success: true,
      message: 'Sincronização realizada com sucesso',
      count: documentsCache.length,
      lastSync: lastSyncTime
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na sincronização',
      message: error.message
    });
  }
});

// Rota de busca por setor
app.get('/api/search', async (req, res) => {
  try {
    const { setor, tipo, status, search } = req.query;
    
    // Se não há cache, sincronizar
    if (documentsCache.length === 0) {
      await syncDocuments();
    }
    
    let filteredDocs = documentsCache;
    
    // Filtrar por setor (busca em todos os setores do documento)
    if (setor) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.setoresArray && doc.setoresArray.some(s => 
          s.toLowerCase().includes(setor.toLowerCase())
        )
      );
    }
    
    // Filtrar por tipo
    if (tipo) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.tipo && doc.tipo.toLowerCase().includes(tipo.toLowerCase())
      );
    }
    
    // Filtrar por status
    if (status) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.status && doc.status.toLowerCase().includes(status.toLowerCase())
      );
    }
    
    // Busca geral (título, assunto, etc.)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        (doc.titulo && doc.titulo.toLowerCase().includes(searchLower)) ||
        (doc.assunto && doc.assunto.toLowerCase().includes(searchLower)) ||
        (doc.epigrafe && doc.epigrafe.toLowerCase().includes(searchLower)) ||
        (doc.orgao && doc.orgao.toLowerCase().includes(searchLower))
      );
    }
    
    res.json({
      success: true,
      data: filteredDocs,
      count: filteredDocs.length,
      total: documentsCache.length,
      filters: { setor, tipo, status, search },
      lastSync: lastSyncTime
    });
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na busca',
      message: error.message
    });
  }
});

// Rota de teste simples
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Função para gerar estatísticas usando documentos únicos
function generateStats(documents) {
  const stats = {
    total: documents.length,
    byStatus: {},
    byType: {},
    byOrgao: {},
    bySetor: {}
  };
  
  documents.forEach(doc => {
    // Contar por status
    if (doc.status) {
      stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
    }
    
    // Contar por tipo
    if (doc.tipo) {
      stats.byType[doc.tipo] = (stats.byType[doc.tipo] || 0) + 1;
    }
    
    // Contar por órgão
    if (doc.orgao) {
      stats.byOrgao[doc.orgao] = (stats.byOrgao[doc.orgao] || 0) + 1;
    }
    
    // Contar por setor (usando todos os setores do array)
    if (doc.setoresArray && doc.setoresArray.length > 0) {
      doc.setoresArray.forEach(setor => {
        stats.bySetor[setor] = (stats.bySetor[setor] || 0) + 1;
      });
    }
  });
  
  return stats;
}

// Rota para estatísticas (usa documentos únicos)
app.get('/api/stats', (req, res) => {
  const stats = generateStats(documentsForStats);
  
  res.json({
    success: true,
    data: {
      totalDocuments: documentsForStats.length, // Documentos únicos
      totalLines: documentsCache.length, // Total de linhas na planilha
      statistics: stats,
      lastSync: lastSyncTime,
      summary: {
        totalUnique: stats.total,
        mostCommonStatus: Object.keys(stats.byStatus).reduce((a, b) => 
          stats.byStatus[a] > stats.byStatus[b] ? a : b, 'N/A'),
        mostCommonType: Object.keys(stats.byType).reduce((a, b) => 
          stats.byType[a] > stats.byType[b] ? a : b, 'N/A'),
        totalSetors: Object.keys(stats.bySetor).length
      }
    }
  });
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    lastSync: lastSyncTime,
    documentsCount: documentsForStats.length, // Mostrar documentos únicos
    totalLines: documentsCache.length, // Total de linhas
    uptime: process.uptime()
  });
});

// Sincronização automática a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  console.log('⏰ Executando sincronização automática...');
  await syncDocuments();
});

// Sincronização inicial
syncDocuments().then(() => {
  console.log('🚀 Servidor iniciado com sincronização inicial');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em: http://localhost:${PORT}/api`);
  console.log(`🔄 Sincronização automática a cada 5 minutos`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
