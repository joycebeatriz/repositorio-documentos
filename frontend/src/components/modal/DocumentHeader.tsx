
import { Badge } from "@/components/ui/badge";

interface DocumentData {
  titulo: string;
  epigrafe: string;
  tipo: string;
  status: string;
}

interface DocumentHeaderProps {
  document: DocumentData;
}

const getTipoBadge = (tipo: string) => {
  const variants = {
    "Regulamento": "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
    "Ata": "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    "Circular": "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    "POP": "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    "Resolução": "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
    "Portaria": "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
  };
  
  return (
    <Badge 
      className={`${variants[tipo as keyof typeof variants] || "bg-gray-100 text-gray-800"} text-xs font-semibold px-3 py-1 rounded-full border-0 shadow-md`}
      aria-label={`Tipo de documento: ${tipo}`}
    >
      {tipo}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  const variants = {
    "Aprovado": "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg",
    "Pendente": "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg",
    "Rejeitado": "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
    "Em Análise": "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
    "Rascunho": "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg",
  };
  
  return (
    <Badge 
      className={`${variants[status as keyof typeof variants] || "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg"} text-xs font-semibold px-3 py-1 rounded-full border-0`}
      aria-label={`Status do documento: ${status}`}
    >
      {status}
    </Badge>
  );
};

const DocumentHeader = ({ document }: DocumentHeaderProps) => {
  return (
            <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-900 mb-2" id="document-title">
            {document.titulo}
          </h2>
          <p className="text-sm text-slate-600 italic mb-3" id="document-subtitle">
            {document.epigrafe}
          </p>
          <div className="flex items-center gap-3" role="group" aria-label="Badges do documento">
            {getTipoBadge(document.tipo)}
            {getStatusBadge(document.status)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;
