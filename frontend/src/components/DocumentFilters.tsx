import { FC, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Filter, RotateCcw } from "lucide-react";
import ComboFilter from "./filters/ComboFilter";
import { PublicDocumentData } from "@/hooks/usePublicDocuments";
import { useSearchParams } from "react-router-dom";

interface DocumentFiltersProps {
  filters: {
    publicoAlvo: string;
    assunto: string;
    tipo: string;
    numero: string;
    orgao: string;
    orgaoSigla: string;
    setor: string;
  };
  setFilters: (f: any) => void;
  allDocuments: PublicDocumentData[];
}

const normalizeFilterString = (str: string) => 
  str.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.-]/g, ' ')
    .replace(/\s+/g, ' ');

const DocumentFilters: FC<DocumentFiltersProps> = ({ filters, setFilters, allDocuments }) => {
  const [searchParams] = useSearchParams();
  const tipoParam = searchParams.get('tipo');
  const activeFiltersCount = Object.values(filters).filter(value => value !== "" && value != null).length;

  useEffect(() => {
    if (tipoParam) {
      setFilters(prev => ({
        ...prev,
        tipo: decodeURIComponent(tipoParam)
      }));
    }
  }, [tipoParam, setFilters]);

  const getUniqueOptions = (key: keyof PublicDocumentData) => {
    const optionsMap = new Map<string, string>();
    
    allDocuments.forEach(doc => {
      const value = String(doc[key] || "");
      if (value.trim() !== "") {
        let normalizedValue = normalizeFilterString(value);

        // Tratamento especial para tipos de documento
        if (key === 'tipo') {
          if (normalizedValue.includes('pop') || 
              normalizedValue.includes('procedimento operacional padrao')) {
            normalizedValue = 'procedimento operacional padrao';
            optionsMap.set(normalizedValue, 'Procedimento Operacional Padrão');
            return;
          }
        }

        if (!optionsMap.has(normalizedValue)) {
          optionsMap.set(normalizedValue, value);
        }
      }
    });

    return Array.from(optionsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, original]) => ({
        value: original,
        label: original
      }));
  };

  const filterConfigs = useMemo(() => [
    {
      name: "assunto",
      label: "Assunto",
      placeholder: "Digite ou selecione um assunto",
      type: "combo",
      options: getUniqueOptions("assunto"),
    },
    {
      name: "tipo",
      label: "Tipo de Documento",
      placeholder: "Selecione o tipo de documento",
      type: "combo",
      options: getUniqueOptions("tipo"),
    },
    {
      name: "numero",
      label: "Número",
      placeholder: "Digite o número do documento",
      type: "input",
      inputType: "number",
    },
    {
      name: "orgao",
      label: "Órgão ou Unidade",
      placeholder: "Selecione o órgão ou unidade",
      type: "combo",
      options: getUniqueOptions("orgao"),
    },
    {
      name: "orgaoSigla",
      label: "Sigla do Órgão",
      placeholder: "Selecione a sigla do órgão",
      type: "combo",
      options: getUniqueOptions("orgaoSigla"),
    },
    {
      name: "setor",
      label: "Setor responsável",
      placeholder: "Selecione o setor responsável",
      type: "combo",
      options: getUniqueOptions("setor"),
    },
    {
      name: "publicoAlvo",
      label: "Público Alvo",
      placeholder: "Selecione o público Alvo",
      type: "combo",
      options: getUniqueOptions("publicoAlvo"),
    },
  ], [allDocuments]);

  const clearAllFilters = () => {
    setFilters({
      publicoAlvo: "",
      assunto: "",
      tipo: "",
      numero: "",
      orgao: "",
      orgaoSigla: "",
      setor: "",
    });
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev: any) => ({ 
      ...prev, 
      [filterName]: value || "" 
    }));
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-3 sm:p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700 h-8 px-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {filterConfigs.map(filter =>
          filter.type === "input" ? (
            <div key={filter.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {filter.label}
              </label>
              <div className="relative">
                <Input
                  placeholder={filter.placeholder}
                  value={filters[filter.name as keyof typeof filters] || ""}
                  onChange={e => handleFilterChange(filter.name, e.target.value)}
                  className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  type={filter.inputType}
                />
                {filters[filter.name as keyof typeof filters] && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange(filter.name, "")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Limpar campo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ) : filter.type === "combo" ? (
            <ComboFilter
              key={filter.name}
              label={filter.label}
              value={filters[filter.name as keyof typeof filters] || ""}
              onChange={val => handleFilterChange(filter.name, val)}
              placeholder={filter.placeholder}
              options={filter.options || []}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default DocumentFilters;