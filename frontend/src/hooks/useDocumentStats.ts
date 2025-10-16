import { useState, useEffect, useCallback } from 'react';

interface DocumentStats {
  totalDocuments: number;
  totalLines: number;
  statistics: {
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byOrgao: Record<string, number>;
    bySetor: Record<string, number>;
  };
  summary: {
    totalUnique: number;
    mostCommonStatus: string;
    mostCommonType: string;
    totalSetors: number;
  };
}

interface StatsResponse {
  success: boolean;
  data: {
    totalDocuments: number;
    totalLines: number;
    statistics: any;
    lastSync: string | null;
    summary: any;
  };
}

const API_BASE_URL = 'http://localhost:3001/api';

export const useDocumentStats = () => {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Função para buscar estatísticas (documentos únicos)
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Buscando estatísticas (documentos únicos)...');
      const response = await fetch(`${API_BASE_URL}/stats`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const result: StatsResponse = await response.json();
      console.log('📊 Estatísticas carregadas:', result.data);
      
      if (result.success) {
        setStats(result.data);
        setLastSync(result.data.lastSync);
        console.log('✅ Estatísticas atualizadas:', result.data.totalDocuments, 'documentos únicos');
      } else {
        throw new Error('Resposta da API não foi bem-sucedida');
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar estatísticas na inicialização
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    lastSync,
    fetchStats
  };
};
