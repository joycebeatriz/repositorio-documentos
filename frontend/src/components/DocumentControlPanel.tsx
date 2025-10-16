
import { useState, useEffect, useCallback } from "react";
import ControlHeader from "./control/ControlHeader";
import ControlSidebar from "./control/ControlSidebar";
import ControlContent from "./control/ControlContent";
import { useDocuments, DocumentData } from "@/hooks/useDocuments";

// Função para converter data do formato DD/MM/YYYY para objeto Date
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

const DocumentControlPanel = () => {
  const { documents: allDocuments } = useDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentData[]>([]);
  const [search, setSearch] = useState("");
  const [currentFilters, setCurrentFilters] = useState<DocumentData[]>([]);

  // Função de busca otimizada
  const applySearchFilter = useCallback((documents: DocumentData[], searchTerm: string) => {
    if (!searchTerm.trim()) return documents;
    
    const lowercaseSearch = searchTerm.toLowerCase().trim();
    const searchTerms = lowercaseSearch.split(/\s+/); // Divide a busca em termos
    
    return documents.filter(doc => {
      // Campos de busca com pesos diferentes, usando optional chaining e fallback
      const searchFields = [
        { field: doc.titulo?.toLowerCase() || '', weight: 10 },
        { field: doc.codigo?.toLowerCase() || '', weight: 8 },
        { field: doc.tipo?.toLowerCase() || '', weight: 6 },
        { field: doc.epigrafe?.toLowerCase() || '', weight: 5 },
        { field: doc.assunto?.toLowerCase() || '', weight: 4 },
        { field: doc.orgao?.toLowerCase() || '', weight: 3 },
        { field: doc.setorResponsavel?.toLowerCase() || '', weight: 2 },
        { field: doc.observacao?.toLowerCase() || '', weight: 1 }
      ];

      // Verifica se todos os termos da busca estão presentes em algum campo
      return searchTerms.every(term => 
        searchFields.some(({ field }) => field.includes(term))
      );
    }).sort((a, b) => {
      // Ordena por relevância
      const getScore = (doc: DocumentData) => {
        let score = 0;
        searchTerms.forEach(term => {
          if (doc.titulo?.toLowerCase().includes(term)) score += 10;
          if (doc.codigo?.toLowerCase().includes(term)) score += 8;
          if (doc.tipo?.toLowerCase().includes(term)) score += 6;
          if (doc.epigrafe?.toLowerCase().includes(term)) score += 5;
          if (doc.assunto?.toLowerCase().includes(term)) score += 4;
          if (doc.orgao?.toLowerCase().includes(term)) score += 3;
          if (doc.setorResponsavel?.toLowerCase().includes(term)) score += 2;
          if (doc.observacao?.toLowerCase().includes(term)) score += 1;
        });
        return score;
      };

      return getScore(b) - getScore(a);
    });
  }, []);

  // Inicializar documentos quando carregarem
  useEffect(() => {
    if (allDocuments.length > 0) {
      const sortedDocuments = [...allDocuments].sort((a, b) => {
        const dateA = parseDate(a.dataDocumento);
        const dateB = parseDate(b.dataDocumento);
        return dateB.getTime() - dateA.getTime();
      });
      
      setCurrentFilters(sortedDocuments);
      setFilteredDocuments(sortedDocuments);
    }
  }, [allDocuments]);

  const handleFiltersChange = (filtered: DocumentData[]) => {
    const sortedFiltered = [...filtered].sort((a, b) => {
      const dateA = parseDate(a.dataDocumento);
      const dateB = parseDate(b.dataDocumento);
      return dateB.getTime() - dateA.getTime();
    });
    setCurrentFilters(sortedFiltered);
  };

  // Efeito para aplicar busca e filtros sempre que 'currentFilters' ou 'search' mudam
  useEffect(() => {
    let results = currentFilters;
    if (search.trim()) {
      results = applySearchFilter(currentFilters, search);
    }
    setFilteredDocuments(results);
  }, [currentFilters, search, applySearchFilter]);

  // Busca em tempo real - esta função agora só atualiza o estado 'search'
  const handleRealTimeSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
  }, []);

  // Atualiza o estado da busca
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <ControlHeader />
      
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <ControlSidebar 
              onFiltersChange={handleFiltersChange}
              documentsData={allDocuments}
            />
            <ControlContent 
              search={search}
              setSearch={handleSearchChange}
              filteredDocuments={filteredDocuments}
              onRealTimeSearch={handleRealTimeSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentControlPanel;
