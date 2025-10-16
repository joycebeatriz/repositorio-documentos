import { useState, useEffect, useCallback, useMemo } from "react";
import DocumentFilters from "./DocumentFilters";
import DocumentTable from "./DocumentTable";
import SearchBar from "./SearchBar";
import SearchStats from "./SearchStats";
import { FileText } from "lucide-react";
import { useGoogleSheetsDocuments, DocumentData } from "@/hooks/useGoogleSheetsDocuments";
import { validateSearchInput } from "@/utils/security";
import { useToast } from "@/hooks/use-toast";

// Tipagem da prop
interface InitialFilterProps {
  tipo?: string;
  publicoAlvo?: string;
  assunto?: string;
  numero?: string;
  orgao?: string;
  orgaoSigla?: string;
  setor?: string;
}

interface DocumentSearchPanelProps {
  initialFilter?: InitialFilterProps;
}

interface EnhancedDocumentData extends DocumentData {
  publicoAlvo?: string;
}

const normalizeString = (str: string) =>
  str.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.-]/g, ' ')
    .replace(/\s+/g, ' ');

const normalizeDocumentType = (type: string) => {
  if (!type) return '';

  const normalized = normalizeString(type);
  
  // Mapear variações para POP
  if (normalized.includes('procedimento operacional padrao') || 
      normalized.includes('procedimento operacional padrão') ||
      normalized.includes('procedimentooperacionalpadrao') ||
      normalized.includes('procedimentooperacionalpadrão')) {
    return 'procedimento operacional padrao';
  }
  
  if (normalized.includes('pop') || normalized.includes('procedimento operacional padrao')) {
    return 'procedimento operacional padrao';
  }
  return normalized;
};

const DocumentSearchPanel: React.FC<DocumentSearchPanelProps> = ({ initialFilter }) => {
  const { documents: allDocuments } = useGoogleSheetsDocuments();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    publicoAlvo: initialFilter?.publicoAlvo || "",
    assunto: initialFilter?.assunto || "",
    tipo: initialFilter?.tipo || "",
    numero: initialFilter?.numero || "",
    orgao: initialFilter?.orgao || "",
    orgaoSigla: initialFilter?.orgaoSigla || "",
    setor: initialFilter?.setor || "",
  });

  const [searchTime, setSearchTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const preprocessedDocuments = useMemo(() => {
    return allDocuments.map(doc => ({
      ...doc,
      publicoAlvo: doc.publicoAlvo || "",
      assunto: doc.assunto || "",
      tipo: doc.tipo || "",
      orgao: doc.orgao || "",
      orgaoSigla: doc.orgaoSigla || "",
      setor: doc.setor || "",
      codigo: doc.codigo || "",
    }));
  }, [allDocuments]);

  const performSearch = useCallback((searchTerm: string) => {
    setIsLoading(true);
    const startTime = performance.now();

    if (searchTerm && !validateSearchInput(searchTerm)) {
      toast({
        title: "Busca inválida",
        description: "Por favor, digite um termo de busca válido.",
        variant: "destructive",
      });
      setIsLoading(false);
      return [];
    }

    const normalizedSearch = normalizeString(searchTerm);

    const result = preprocessedDocuments.filter(doc => {
      const searchMatch = !normalizedSearch ||
        normalizeString(doc.titulo).includes(normalizedSearch) ||
        normalizeString(doc.epigrafe).includes(normalizedSearch) ||
        normalizeString(doc.tipo).includes(normalizedSearch) ||
        normalizeString(doc.orgao).includes(normalizedSearch) ||
        normalizeString(doc.orgaoSigla).includes(normalizedSearch) ||
        normalizeString(doc.setor).includes(normalizedSearch) ||
        normalizeString(doc.publicoAlvo).includes(normalizedSearch);

      const tipoMatch = !filters.tipo ||
        normalizeDocumentType(doc.tipo) === normalizeDocumentType(filters.tipo) ||
        (doc.tipoSigla && normalizeDocumentType(doc.tipoSigla) === normalizeDocumentType(filters.tipo));

      const publicoAlvoMatch = !filters.publicoAlvo ||
        normalizeString(doc.publicoAlvo).includes(normalizeString(filters.publicoAlvo));

      const assuntoMatch = !filters.assunto ||
        normalizeString(doc.assunto).includes(normalizeString(filters.assunto));

      const numeroMatch = !filters.numero ||
        doc.numero?.toString() === filters.numero;

      const orgaoMatch = !filters.orgao ||
        normalizeString(doc.orgao).includes(normalizeString(filters.orgao));

      const orgaoSiglaMatch = !filters.orgaoSigla ||
        normalizeString(doc.orgaoSigla).includes(normalizeString(filters.orgaoSigla));

      const setorMatch = !filters.setor ||
        normalizeString(doc.setor).includes(normalizeString(filters.setor));

      return searchMatch && tipoMatch && publicoAlvoMatch && assuntoMatch &&
        numeroMatch && orgaoMatch && orgaoSiglaMatch && setorMatch;
    });

    if (normalizedSearch) {
      const calculateScore = (doc: EnhancedDocumentData) => {
        let score = 0;
        if (normalizeString(doc.titulo).includes(normalizedSearch)) score += 10;
        if (normalizeString(doc.epigrafe).includes(normalizedSearch)) score += 5;
        if (normalizeString(doc.tipo).includes(normalizedSearch)) score += 2;
        if (normalizeString(doc.orgao).includes(normalizedSearch)) score += 1;
        if (normalizeString(doc.setor).includes(normalizedSearch)) score += 1;
        return score;
      };
      result.sort((a, b) => calculateScore(b) - calculateScore(a));
    } else {
      result.sort((a, b) => a.titulo.localeCompare(b.titulo));
    }

    const endTime = performance.now();
    setSearchTime(endTime - startTime);
    setIsLoading(false);
    return result;
  }, [preprocessedDocuments, filters, toast]);

  const filteredDocs = useMemo(() => {
    return performSearch(search);
  }, [performSearch, search]);

  const handleRealTimeSearch = useCallback((debouncedSearch: string) => {
    setSearch(debouncedSearch);
  }, []);

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  const documentsForTable = useMemo(() => {
    return (filteredDocs || []).map(doc => ({
      id: doc.id.toString(),
      status: doc.status || "Ativo",
      codigo: doc.codigo || "",
      tipo: doc.tipo,
      numero: doc.numero?.toString() || "",
      titulo: doc.titulo,
      epigrafe: doc.epigrafe || "",
      assunto: doc.assunto || "",
      orgao: doc.orgao,
      setor: doc.setor,
      setorResponsavel: doc.setorResponsavel || doc.setor,
      dataDocumento: doc.dataDocumento || "01/01/2023",
      linkAcesso: doc.linkAcesso || "#",
      nivelAcesso: doc.nivelAcesso || "Público",
      localArquivo: doc.localArquivo || "Sistema",
      observacao: doc.observacao || "",
      tipoSigla: doc.tipoSigla || "",
      codSIORG: doc.codSIORG || "",
      orgaoSigla: doc.orgaoSigla || "",
    }));
  }, [filteredDocs]);

  return (
    <div className="w-full max-w-none mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="text-center mb-16">
        <div className="inline-block">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Busque seus documentos
            </h2>
          </div>
        </div>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Use os filtros abaixo para encontrar 
          <span className="text-emerald-600 font-semibold"> exatamente o que precisa</span>
        </p>
      </div>

      <div className="w-full py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-3 sm:p-4 lg:p-6">
            <SearchBar
              search={search}
              setSearch={setSearch}
              onRealTimeSearch={handleRealTimeSearch}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            <div className="xl:col-span-1 order-6 xl:order-1">
              <div className="xl:sticky xl:top-50">
                <DocumentFilters
                  filters={filters}
                  setFilters={setFilters}
                  allDocuments={preprocessedDocuments}
                />
              </div>
            </div>

            <div className="xl:col-span-4 space-y-4 sm:space-y-6 order-1 xl:order-2">
              <SearchStats
                activeFiltersCount={activeFiltersCount}
                resultsCount={filteredDocs?.length || 0}
                searchTime={searchTime}
                searchTerm={search}
              />

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <DocumentTable
                  documents={documentsForTable}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSearchPanel;
