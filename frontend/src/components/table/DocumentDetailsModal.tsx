import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sanitizeUrl } from "@/utils/security";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentData } from "@/types/document";

interface DocumentDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentData | null;
}

const getStatusBadge = (status: string) => {
  // Mapeamento atualizado para incluir todos os status possíveis
  const variants = {
    "Aprovado": "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg",
    "Pendente": "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg",
    "Rejeitado": "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
    "Em Análise": "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
    "Rascunho": "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg",
    "Ativo": "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
    "Publicado": "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg",
    "Vigente": "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg",
    "Revogado": "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg",
    "Em Consulta": "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg",
    "Arquivado": "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg",
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

const DocumentDetailsModal = ({ isOpen, onOpenChange, document }: DocumentDetailsModalProps) => {
  if (!document) return null;

  // Sanitizar URL antes de usar
  const safeLink = sanitizeUrl(document.linkAcesso);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-5xl max-h-[85vh] overflow-y-auto bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900" id="modal-title">
            Detalhes do Documento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4" role="main">
          {/* Cabeçalho com título e status */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  {document.titulo}
                </h2>
                <p className="text-sm text-slate-600 italic">
                  {document.epigrafe}
                </p>
              </div>
              {getStatusBadge(document.status)}
            </div>
          </div>

          {/* Grid principal com informações organizadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Coluna 1 - Identificação */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                Identificação
              </h3>
              
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Código
                </label>
                <p className="text-sm text-slate-900 font-medium">
                  {document.codigo}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Tipo
                </label>
                <p className="text-sm text-slate-900">
                  {document.tipo}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Número
                </label>
                <p className="text-sm text-slate-900">
                  {document.numero}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  ID
                </label>
                <p className="text-sm text-slate-900 font-medium">
                  {document.id}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Tipo (sigla)
                </label>
                <p className="text-sm text-slate-900">
                  {document.tipoSigla}
                </p>
              </div>
            </div>

            {/* Coluna 2 - Organização */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                Organização
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Órgão ou Unidade
                </label>
                <p className="text-sm text-slate-900 font-medium">
                  {document.orgao}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Setor Responsável
                </label>
                <p className="text-sm text-slate-900">
                  {document.setor || document.setorResponsavel || 'Não informado'}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Data (documento)
                </label>
                <p className="text-sm text-slate-900">
                  {document.dataDocumento ? document.dataDocumento.split(' ')[0] : 'Não informado'}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Órgão ou Unidade (sigla)
                </label>
                <p className="text-sm text-slate-900">
                  {document.orgaoSigla}
                </p>
              </div>
            </div>

            {/* Coluna 3 - Conteúdo e Acesso */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                Conteúdo e Acesso
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Título
                </label>
                <p className="text-sm text-slate-900 font-medium">
                  {document.titulo}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Epígrafe
                </label>
                <p className="text-sm text-slate-900 italic">
                  {document.epigrafe}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Assunto
                </label>
                <p className="text-sm text-slate-900">
                  {document.assunto}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Nível de Acesso
                </label>
                <p className="text-sm text-slate-900">
                  {document.nivelAcesso}
                </p>
              </div>

              {safeLink && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => window.open(safeLink, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Acessar Documento
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDetailsModal;
