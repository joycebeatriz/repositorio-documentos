import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, FileText, Loader2, MoreVertical, ExternalLink, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import DocumentDetailsModal from "./table/DocumentDetailsModal";
import SearchResultsStats from "./table/SearchResultsStats";
import PaginationControls from "./ui/pagination-controls";
import { usePagination } from "@/hooks/usePagination";
import { useSorting } from "@/hooks/useSorting";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { DocumentData } from "@/types/document";

interface ControlTableProps {
  documentsData: DocumentData[];
  isSearching?: boolean;
}

const getStatusBadge = (status: string) => {
  const variants = {
    "Aprovado": "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg",
    "Pendente": "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg",
    "Rejeitado": "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
    "Em Análise": "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
    "Rascunho": "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg",
    "Ativo": "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg",
    "Em revisão": "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg",
    "Inativo": "bg-gradient-to-r from-stone-500 to-gray-600 text-white shadow-lg",
  };
  
  return (
    <Badge 
      className={`${variants[status as keyof typeof variants] || "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg"} text-xs font-semibold px-3 py-1 rounded-full border-0 whitespace-nowrap min-w-max`}
    >
      {status}
    </Badge>
  );
};

const ControlTable = ({ documentsData, isSearching = false }: ControlTableProps) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  // Implementar ordenação (mantendo padrão por data)
  const { sortedData } = useSorting({
    data: documentsData,
    defaultSort: { key: 'dataDocumento', direction: 'desc' }
  });

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    currentData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setItemsPerPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({ 
    data: sortedData, 
    itemsPerPage: 25 
  });

  const handleRowClick = (doc: DocumentData, event?: React.MouseEvent) => {
    // Se foi passado um evento, verifica se o clique foi em um botão ou elemento interativo
    if (event) {
      const target = event.target as HTMLElement;
      const isButton = target.closest('button') || target.closest('[role="button"]');
      
      if (!isButton && doc.linkAcesso) {
        handleOpenLink(doc.linkAcesso, doc.titulo, event);
        return;
      }
    }
    
    // Comportamento padrão: abrir modal de detalhes
    setSelectedDocument(doc);
    setIsDetailsOpen(true);
  };

  const handleOpenLink = (link: string, title: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyLink = async (link: string, title: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        toast({
          title: "Link Copiado!",
          description: `O link para \"${title}\" foi copiado para a área de transferência.`, 
          className: "bg-green-100 text-green-700 border-green-200"
        });
      } catch (err) {
        console.error("Falha ao copiar o link:", err);
        toast({
          title: "Erro ao Copiar",
          description: "Não foi possível copiar o link. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  // Gestos de swipe para mobile
  const { swipeHandlers } = useSwipeGesture({
    onSwipeLeft: () => goToNextPage(),
    onSwipeRight: () => goToPreviousPage(),
  });

  return (
    <div className="space-y-4">
      <SearchResultsStats documentsData={documentsData} />

      {/* Table Container */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto" {...swipeHandlers}>
          {/* Versão Desktop */}
          <div className="hidden lg:block">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 via-blue-50 to-blue-50 border-b-2 border-slate-200/80 hover:bg-gradient-to-r hover:from-slate-100 hover:via-blue-100 hover:to-blue-100 transition-all duration-500">
                  <TableHead className="py-6 px-4 w-[8%]">
                    Status
                  </TableHead>
                  <TableHead className="py-6 px-4 w-[12%]">
                    Código
                  </TableHead>
                  <TableHead className="font-bold text-slate-800 text-sm py-6 px-4 tracking-wide w-[30%]" scope="col">Título</TableHead>
                  <TableHead className="py-6 px-4 w-[15%]">
                    Tipo
                  </TableHead>
                  <TableHead className="py-6 px-4 w-[20%]">
                    Órgão/Unidade
                  </TableHead>
                  <TableHead className="py-6 px-4 w-[10%]">
                    Data
                  </TableHead>
                  <TableHead className="font-bold text-slate-800 text-xs py-6 px-4 tracking-wide text-center w-[5%]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((doc, idx) => (
                  <TableRow 
                    key={idx} 
                    className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-blue-50/60 hover:to-blue-50/60 border-b border-slate-100/60 transition-all duration-500 group hover:shadow-sm cursor-pointer"
                    onClick={(e) => handleRowClick(doc, e)}
                    tabIndex={0}
                    role="row"
                    aria-label={`Documento: ${doc.titulo}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (doc.linkAcesso) {
                          handleOpenLink(doc.linkAcesso, doc.titulo, e as any);
                        } else {
                          handleRowClick(doc);
                        }
                      }
                    }}
                  >
                    <TableCell className="py-6 px-4">
                      {getStatusBadge(doc.status)}
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <div className="text-xs font-medium text-slate-800">
                        {doc.codigo}
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-4" role="gridcell">
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-900">{doc.titulo}</p>
                        <p className="text-xs italic text-slate-600">{doc.epigrafe}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <div className="text-xs italic text-slate-700">
                        {doc.tipo}
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <div className="text-xs font-semibold text-slate-800 max-w-32 truncate">
                        {doc.orgao}
                      </div>
                      <div className="text-xs text-slate-600 max-w-32 truncate">
                        {doc.setorResponsavel}
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {doc.dataDocumento.split(' ')[0]}
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100" 
                          onClick={() => handleRowClick(doc)}
                          aria-label="Ver detalhes do título"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {doc.linkAcesso && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                            onClick={(e) => handleOpenLink(doc.linkAcesso, doc.titulo, e)}
                            aria-label="Abrir título em nova aba"
                          >
                            <ExternalLink size={20} />
                          </Button>
                        )}
                        {doc.linkAcesso && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100" 
                            onClick={(e) => handleCopyLink(doc.linkAcesso, doc.titulo, e)}
                            aria-label="Copiar link do documento"
                          >
                            <LinkIcon size={20} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Versão Mobile - Otimizada para touch */}
          <div className="lg:hidden space-y-4 p-4">
            {currentData.map((doc, idx) => (
              <div 
                key={idx} 
                className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-white/80 group cursor-pointer active:scale-95 touch-manipulation"
                onClick={(e) => handleRowClick(doc, e)}
                tabIndex={0}
                role="article"
                aria-label={`Documento: ${doc.titulo}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (doc.linkAcesso) {
                      handleOpenLink(doc.linkAcesso, doc.titulo, e as any);
                    } else {
                      handleRowClick(doc);
                    }
                  }
                }}
                {...swipeHandlers}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-blue-700 transition-colors">
                        {doc.titulo}
                      </h3>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        {doc.epigrafe}
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRowClick(doc)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          {doc.linkAcesso && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleOpenLink(doc.linkAcesso, doc.titulo, e as any);
                            }}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Abrir Link
                            </DropdownMenuItem>
                          )}
                          {doc.linkAcesso && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLink(doc.linkAcesso, doc.titulo, e as any);
                            }}>
                              <LinkIcon className="mr-2 h-4 w-4" />
                              Copiar Link
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><strong>Código:</strong> {doc.codigo}</div>
                    <div><strong>Órgão:</strong> {doc.orgao}</div>
                    <div><strong>Data:</strong> {doc.dataDocumento.split(' ')[0]}</div>
                    <div><strong>Setor:</strong> {doc.setorResponsavel}</div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Eye className="w-3 h-3" />
                      Toque para ver detalhes
                    </div>
                    <div className="text-xs text-gray-500">
                      ← Deslize para navegar →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {documentsData.length === 0 && (
            <div className="py-20 text-center">
              <div className="mb-6">
                <FileText className="w-16 h-16 text-gray-300 mx-auto animate-bounce" />
              </div>
              <div className="text-gray-600 font-bold text-xl mb-3">Nenhum título encontrado</div>
              <div className="text-gray-500">
                Tente ajustar os filtros de busca ou termo pesquisado para encontrar os títulos desejados
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {documentsData.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            onPageChange={goToPage}
            onItemsPerPageChange={setItemsPerPage}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
          />
        )}
      </div>

      <DocumentDetailsModal 
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        document={selectedDocument}
      />
    </div>
  );
};

export default ControlTable;
