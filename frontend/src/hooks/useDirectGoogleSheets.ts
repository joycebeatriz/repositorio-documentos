import { useState, useEffect, useCallback } from 'react';
import { GOOGLE_SHEETS_CONFIG, buildValuesUrl, buildSheetsUrl, validateConfig } from '@/config/googleSheets';

interface DocumentData {
  id: string;
  status: string;
  codigo: string;
  tipo: string;
  numero: string;
  titulo: string;
  epigrafe: string;
  assunto: string;
  orgao: string;
  setor: string;
  setorResponsavel: string;
  dataDocumento: string;
  linkAcesso: string;
  nivelAcesso: string;
  localArquivo: string;
  observacao: string;
  tipoSigla: string;
  codSIORG: string;
  orgaoSigla: string;
  orgaoUnidade?: string;
  orgaoUnidadeSigla?: string;
  setoresArray?: string[];
}

export const useDirectGoogleSheets = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Função para converter data do formato YYYY-MM-DD HH:MM:SS para objeto Date
  const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date();
    
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Função para mapear cabeçalhos da planilha para campos padronizados
  const mapHeaderToField = (header: string): string => {
    const headerLower = header.toLowerCase();
    
    switch(headerLower) {
      case 'status':
        return 'status';
      case 'código':
        return 'codigo';
      case 'tipo':
        return 'tipo';
      case 'número':
        return 'numero';
      case 'título':
        return 'titulo';
      case 'epígrafe':
        return 'epigrafe';
      case 'id':
        return 'id';
      case 'assunto':
        return 'assunto';
      case 'orgão ou unidade':
        return 'orgao';
      case 'setor responsável':
        return 'setorResponsavel';
      case 'data (documento)':
        return 'dataDocumento';
      case 'link de acesso':
        return 'linkAcesso';
      case 'nível de acesso':
        return 'nivelAcesso';
      case 'local do arquivo':
        return 'localArquivo';
      case 'observação':
        return 'observacao';
      case 'tipo (sigla)':
        return 'tipoSigla';
      case 'codsiorg':
        return 'codSIORG';
      case 'orgão ou unidade (sigla)':
        return 'orgaoSigla';
      default:
        return header;
    }
  };

  // Função para buscar dados diretamente do Google Sheets
  const fetchDocumentsFromSheets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validar configurações
      const configValidation = validateConfig();
      if (!configValidation.isValid) {
        throw new Error(`Configuração inválida: ${configValidation.issues.join(', ')}`);
      }
      
      console.log('🔄 Buscando dados diretamente do Google Sheets...');
      console.log('📍 Configurações:', {
        API_KEY: GOOGLE_SHEETS_CONFIG.API_KEY ? '✅ Configurada' : '❌ Não configurada',
        SPREADSHEET_ID: GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID ? '✅ Configurada' : '❌ Não configurada',
        RANGE: GOOGLE_SHEETS_CONFIG.RANGE
      });
      
      const url = buildValuesUrl();
      console.log('📍 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Adicionar timeout para evitar travamentos
        signal: AbortSignal.timeout(30000) // 30 segundos
      });
      
      console.log('📡 Resposta HTTP:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        
        if (response.status === 403) {
          throw new Error('Erro 403: API Key inválida ou planilha não pública. Verifique as configurações.');
        } else if (response.status === 404) {
          throw new Error('Erro 404: Planilha não encontrada. Verifique o ID da planilha.');
        } else if (response.status === 429) {
          throw new Error('Erro 429: Limite de requisições excedido. Tente novamente em alguns minutos.');
        } else {
          throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('📊 Resposta do Google Sheets:', data);
      
      if (!data.values || data.values.length === 0) {
        throw new Error('Nenhum dado encontrado na planilha');
      }
      
      // Primeira linha são os cabeçalhos
      const headers = data.values[0];
      const dataRows = data.values.slice(1);
      
      console.log('📋 Cabeçalhos encontrados:', headers);
      console.log('📄 Linhas de dados:', dataRows.length);
      
      // Converter para objetos com mapeamento correto das colunas
      const mappedDocuments = dataRows.map((row: any[], index: number) => {
        const doc: any = {};
        
        // Mapear colunas da planilha para campos do sistema
        headers.forEach((header: string, colIndex: number) => {
          const value = row[colIndex] || '';
          const fieldName = mapHeaderToField(header);
          doc[fieldName] = value;
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
        
        return doc as DocumentData;
      });
      
      // Ordenar documentos por data (mais novos primeiro)
      const sortedDocuments = mappedDocuments.sort((a, b) => {
        const dateA = parseDate(a.dataDocumento);
        const dateB = parseDate(b.dataDocumento);
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log('✅ Documentos carregados:', sortedDocuments.length);
      setDocuments(sortedDocuments);
      setLastSync(new Date().toISOString());
      setIsOnline(true);
      
      return sortedDocuments;
      
    } catch (err) {
      console.error('❌ Erro ao buscar dados do Google Sheets:', err);
      
      let errorMessage = 'Erro desconhecido';
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error('Tipo do erro:', err.name);
        console.error('Stack trace:', err.stack);
      }
      
      setError(errorMessage);
      setIsOnline(false);
      setDocuments([]);
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para forçar sincronização
  const syncDocuments = useCallback(async () => {
    try {
      await fetchDocumentsFromSheets();
      return { success: true, message: 'Sincronização realizada com sucesso' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na sincronização';
      return { success: false, error: errorMessage };
    }
  }, [fetchDocumentsFromSheets]);

  // Função para verificar status da conexão
  const checkConnectionStatus = useCallback(async () => {
    try {
      const url = buildSheetsUrl();
      const response = await fetch(url);
      
      if (response.ok) {
        setIsOnline(true);
        return { success: true, status: 'online' };
      } else {
        setIsOnline(false);
        return { success: false, status: 'offline' };
      }
    } catch (err) {
      setIsOnline(false);
      return { success: false, status: 'offline' };
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchDocumentsFromSheets();
    
    // Verificar status da conexão periodicamente
    const statusInterval = setInterval(checkConnectionStatus, 30000); // A cada 30 segundos
    
    return () => {
      clearInterval(statusInterval);
    };
  }, [fetchDocumentsFromSheets, checkConnectionStatus]);

  return {
    documents,
    loading,
    error,
    lastSync,
    isOnline,
    fetchDocuments: fetchDocumentsFromSheets,
    syncDocuments,
    checkApiStatus: checkConnectionStatus,
    setDocuments
  };
};

export type { DocumentData };
