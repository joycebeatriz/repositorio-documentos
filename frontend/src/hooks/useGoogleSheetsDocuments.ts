import { useState, useEffect, useCallback } from 'react';

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
}

interface ApiResponse {
  success: boolean;
  data: DocumentData[];
  lastSync: string | null;
  count: number;
}

interface SyncResponse {
  success: boolean;
  message: string;
  count: number;
  lastSync: string | null;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const useGoogleSheetsDocuments = () => {
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

  // Função para buscar documentos da API
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Buscando documentos da API...');
      console.log('📍 URL:', `${API_BASE_URL}/documents`);
      const response = await fetch(`${API_BASE_URL}/documents`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      console.log('📊 Resposta da API:', result);
      console.log('📄 Documentos encontrados:', result.count);
      
      if (result.success) {
        // Mapear os dados e ordenar por data (mais novos primeiro)
        const mappedDocuments = result.data.map((doc: any) => {
          const documentData: DocumentData = {
            id: doc.id,
            status: doc.status,
            codigo: doc.codigo,
            tipo: doc.tipo,
            numero: doc.numero,
            titulo: doc.titulo,
            epigrafe: doc.epigrafe,
            assunto: doc.assunto,
            orgao: doc.orgao,
            setor: doc.setor,
            setorResponsavel: doc.setorResponsavel,
            setoresArray: doc.setoresArray || [],
            dataDocumento: doc.dataDocumento,
            linkAcesso: doc.linkAcesso,
            nivelAcesso: doc.nivelAcesso,
            localArquivo: doc.localArquivo,
            observacao: doc.observacao,
            tipoSigla: doc.tipoSigla,
            codSIORG: doc.codSIORG,
            orgaoSigla: doc.orgaoSigla,
            orgaoUnidade: doc.orgaoUnidade,
            orgaoUnidadeSigla: doc.orgaoUnidadeSigla,
          };
          return documentData;
        });

        // Ordenar documentos por data (mais novos primeiro)
        const sortedDocuments = mappedDocuments.sort((a, b) => {
          const dateA = parseDate(a.dataDocumento);
          const dateB = parseDate(b.dataDocumento);
          return dateB.getTime() - dateA.getTime();
        });
        
        console.log('✅ Documentos carregados:', sortedDocuments.length);
        setDocuments(sortedDocuments);
        setLastSync(result.lastSync);
        setIsOnline(true);
      } else {
        throw new Error('Resposta da API não foi bem-sucedida');
      }
    } catch (err) {
      console.error('Erro ao buscar documentos:', err);
      console.error('Erro detalhado:', err);
      
      let errorMessage = 'Erro desconhecido';
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error('Tipo do erro:', err.name);
        console.error('Stack trace:', err.stack);
      }
      
      setError(errorMessage);
      setIsOnline(false);
      
      // NÃO usar fallback - sistema deve funcionar apenas com Google Sheets
      console.log('❌ Erro na sincronização com Google Sheets. Sistema requer conexão com a planilha.');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para forçar sincronização
  const syncDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/sync`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const result: SyncResponse = await response.json();
      
      if (result.success) {
        setLastSync(result.lastSync);
        // Buscar os dados atualizados
        await fetchDocuments();
        return { success: true, message: result.message };
      } else {
        throw new Error('Sincronização não foi bem-sucedida');
      }
    } catch (err) {
      console.error('Erro na sincronização:', err);
      setError(err instanceof Error ? err.message : 'Erro na sincronização');
      return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' };
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments]);

  // Função para verificar status da API
  const checkApiStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      const result = await response.json();
      setIsOnline(result.success && result.status === 'online');
      return result;
    } catch (err) {
      setIsOnline(false);
      return { success: false, status: 'offline' };
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchDocuments();
    
    // Verificar status da API periodicamente
    const statusInterval = setInterval(checkApiStatus, 30000); // A cada 30 segundos
    
    return () => {
      clearInterval(statusInterval);
    };
  }, [fetchDocuments, checkApiStatus]);

  return {
    documents,
    loading,
    error,
    lastSync,
    isOnline,
    fetchDocuments,
    syncDocuments,
    checkApiStatus,
    setDocuments
  };
};

export type { DocumentData };
