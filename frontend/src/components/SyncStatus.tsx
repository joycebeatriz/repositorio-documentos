import { FC, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useGoogleSheetsDocuments } from '@/hooks/useGoogleSheetsDocuments';
import { cn } from '@/lib/utils';

interface SyncStatusProps {
  className?: string;
}

export const SyncStatus: FC<SyncStatusProps> = ({ className = '' }) => {
  const { 
    loading, 
    error, 
    lastSync, 
    isOnline, 
    syncDocuments 
  } = useGoogleSheetsDocuments();
  
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função para mostrar tooltip com delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // 500ms de delay
  };

  // Função para esconder tooltip com delay
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 200); // 200ms de delay para esconder
  };

  // Cleanup do timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSync = async () => {
    const result = await syncDocuments();
    if (result.success) {
      console.log('✅ Sincronização realizada com sucesso');
    } else {
      console.error('❌ Erro na sincronização:', result.error);
    }
  };

  const formatLastSync = (syncTime: string | null) => {
    if (!syncTime) return 'Nunca';
    
    const date = new Date(syncTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Agora';
    if (diffMinutes < 60) return `${diffMinutes} min atrás`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Status da Conexão - Simplificado */}
      <div className="flex items-center">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-600" title="Online" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" title="Offline" />
        )}
      </div>

      {/* Botão de Sincronização com Tooltip Customizado */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSync}
          disabled={loading}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200",
            error && "text-red-500 hover:text-red-600"
          )}
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          <span className="hidden sm:inline">
            {loading ? 'Sincronizando...' : 'Sync'}
          </span>
        </Button>

        {/* Tooltip Customizado */}
        {showTooltip && (
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded shadow-sm whitespace-nowrap z-50 transition-opacity duration-200"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={handleMouseLeave}
          >
            {error ? `Erro: ${error}` : `Última sincronização: ${formatLastSync(lastSync)}`}
            {/* Seta do tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-100"></div>
          </div>
        )}
      </div>
    </div>
  );
};