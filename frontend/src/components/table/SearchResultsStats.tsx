
import { TrendingUp, Clock, Eye } from "lucide-react";

interface DocumentData {
  id: string;
  status: string;
  codigo: string;
  tipo: string;
  numero: string;
  titulo: string;
  epigrafe: string;
  assunto: string;
  orgaoUnidade: string;
  setorResponsavel: string;
  dataDocumento: string;
  linkAcesso: string;
  nivelAcesso: string;
  localArquivo: string;
  observacao: string;
  tipoSigla: string;
  codSIORG: string;
  orgaoUnidadeSigla: string;
}

interface SearchResultsStatsProps {
  documentsData: DocumentData[];
}

const SearchResultsStats = ({ documentsData }: SearchResultsStatsProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Eye className="w-4 h-4" />
          <span>Clique na linha para ver todos os detalhes</span>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsStats;
