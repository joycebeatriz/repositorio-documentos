import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "./ui/loading-spinner";
import PaginationControls from "./ui/pagination-controls";
import { usePagination } from "@/hooks/usePagination";
import { Users, Calendar, MapPin, FileText, ExternalLink, Eye, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import DocumentDetailsModal from "./table/DocumentDetailsModal";
import { useToast } from "@/hooks/use-toast";
import { DocumentData } from "@/hooks/useDocuments";

interface DocumentTableProps {
  documents: DocumentData[];
  isLoading?: boolean;
}

const DocumentTable = ({ documents, isLoading = false }: DocumentTableProps) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

    // Cria campo "orgaoComSigla" a partir de orgao + orgaoSigla
  const documentosComSigla = documents.map(doc => ({
    ...doc,
    orgaoComSigla: doc.orgaoSigla ? `${doc.orgao} (${doc.orgaoSigla})` : doc.orgao
  }));

  // Usa os documentos modificados na paginação
  const {
    currentData,
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    totalItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setItemsPerPage,
  } = usePagination({ data: documentosComSigla, itemsPerPage: 10 });


  const handleOpenLink = (link: string, title: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleViewDetails = (doc: DocumentData) => {
    setSelectedDocument(doc);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedDocument(null);
  };

  const handleCopyLink = (link: string, title: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: `O link do documento "${title}" foi copiado para a área de transferência.`,
      duration: 3000,
    });
  };

  const handleRowClick = (doc: DocumentData, event: React.MouseEvent) => {
    // Verifica se o clique foi em um botão ou elemento interativo
    const target = event.target as HTMLElement;
    const isButton = target.closest('button') || target.closest('[role="button"]');
    
    if (!isButton && doc.linkAcesso) {
      handleOpenLink(doc.linkAcesso, doc.titulo);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4 text-blue-600" />
        <div className="text-slate-600 font-medium">Carregando documentos...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="hidden lg:block">
        <Table role="table" aria-label="Tabela de documentos" className="w-full">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-50 via-blue-50 to-blue-50 border-b-2 border-slate-200/80 hover:bg-gradient-to-r hover:from-slate-100 hover:via-blue-100 hover:to-blue-100 transition-all duration-500">
              <TableHead className="font-bold text-slate-800 text-sm py-6 px-4 tracking-wide w-[35%]" scope="col">Título</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm py-6 px-4 tracking-wide w-[18%]" scope="col">Tipo</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm py-6 px-4 tracking-wide w-[25%]" scope="col">Órgão/Unidade</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm py-6 px-4 tracking-wide w-[17%]" scope="col">Setor Responsável</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm py-6 px-4 text-center tracking-wide w-[5%]" scope="col">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((doc, idx) => (
              <TableRow
                key={idx}
                className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-blue-50/60 hover:to-blue-50/60 border-b border-slate-100/60 transition-all duration-500 group hover:shadow-sm cursor-pointer focus-within:bg-blue-50/40"
                tabIndex={0}
                role="row"
                aria-label={`Documento: ${doc.titulo}`}
                onClick={(e) => handleRowClick(doc, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (doc.linkAcesso) {
                      handleOpenLink(doc.linkAcesso, doc.titulo);
                    }
                  }
                }}
              >
                <TableCell className="py-6 px-4" role="gridcell">
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">{doc.titulo}</p>
                    <p className="text-xs italic text-slate-600">{doc.epigrafe}</p>
                  </div>
                </TableCell>
                <TableCell className="py-6 px-4 italic" role="gridcell">{doc.tipo}</TableCell>
                <TableCell className="py-6 px-4" role="gridcell">{doc.orgao}</TableCell>
                <TableCell className="py-6 px-4" role="gridcell">{doc.setorResponsavel || 'Não informado'}</TableCell>
                <TableCell className="py-6 px-4 text-center" role="gridcell">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Ver detalhes do documento ${doc.titulo}`}
                      onClick={() => handleViewDetails(doc)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      <Eye size={20} />
                    </Button>
                    {doc.linkAcesso && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Abrir link do documento ${doc.titulo}`}
                          onClick={() => handleOpenLink(doc.linkAcesso!, doc.titulo)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        >
                          <ExternalLink size={20} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Copiar link do documento ${doc.titulo}`}
                          onClick={() => handleCopyLink(doc.linkAcesso!, doc.titulo)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        >
                          <LinkIcon size={20} />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="lg:hidden space-y-4 p-4">
        {currentData.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-white/80 group cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
            tabIndex={0}
            role="article"
            aria-label={`Documento: ${doc.titulo}`}
            onClick={(e) => handleRowClick(doc, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (doc.linkAcesso) {
                  handleOpenLink(doc.linkAcesso, doc.titulo);
                }
              }
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-2 group-hover:text-blue-700 transition-colors">
                    {doc.titulo}
                  </h3>
                  <p className="text-xs text-slate-600 italic leading-relaxed mb-3">
                    {doc.epigrafe}
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-3" role="group" aria-label="Badges do documento">
                  <span className="text-xs text-slate-600 italic">
                    {doc.tipo}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                    {doc.orgao}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                      <Users className="w-3 h-3 text-slate-500" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{doc.setorResponsavel || 'Não informado'}</span>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Ver detalhes do documento ${doc.titulo}`}
                  onClick={() => handleViewDetails(doc)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  <Eye size={20} />
                </Button>
                {doc.linkAcesso && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Abrir link do documento ${doc.titulo}`}
                      onClick={() => handleOpenLink(doc.linkAcesso!, doc.titulo)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      <ExternalLink size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Copiar link do documento ${doc.titulo}`}
                      onClick={() => handleCopyLink(doc.linkAcesso!, doc.titulo)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      <LinkIcon size={20} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDocument && (
        <DocumentDetailsModal
          isOpen={isDetailsOpen}
          onOpenChange={handleCloseDetails}
          document={selectedDocument}
        />
      )}

      <div className="mt-6">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          onNextPage={goToNextPage}
          onPreviousPage={goToPreviousPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>

      {documents.length === 0 && (
        <div className="py-20 text-center" role="status" aria-live="polite">
          <div className="mb-6">
            <FileText className="w-16 h-16 text-gray-300 mx-auto animate-bounce" />
          </div>
          <div className="text-gray-600 font-bold text-xl mb-3">Nenhum documento encontrado</div>
          <div className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Tente ajustar o termo pesquisado para encontrar os documentos desejados
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTable;
