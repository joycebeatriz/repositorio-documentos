import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FilterHeader from "./filters/FilterHeader";
import ComboFilter from "./filters/ComboFilter";

interface FilterState {
  status: string;
  codigo: string;
  tipo: string;
  titulo: string;
  id: string;
  orgao: string;
  setorResponsavel: string;
  ano: string;
  nivelAcesso: string;
  tipoSigla: string;
  codSIORG: string;
  orgaoSigla: string;
}

interface DocumentData {
  id: string;
  status: string;
  codigo: string;
  tipo: string;
  numero: string;
  titulo: string;
  epigrafe: string;
  assunto: string;
  orgao: string;
  setorResponsavel: string;
  dataDocumento: string;
  linkAcesso: string;
  nivelAcesso: string;
  localArquivo: string;
  observacao: string;
  tipoSigla: string;
  codSIORG: string;
  orgaoSigla: string;
}

interface ControlFiltersProps {
  onFiltersChange: (filteredDocuments: DocumentData[]) => void;
  documentsData: DocumentData[];
}

const ControlFilters = ({ onFiltersChange, documentsData }: ControlFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    codigo: "",
    tipo: "",
    titulo: "",
    id: "",
    orgao: "",
    setorResponsavel: "",
    ano: "",
    nivelAcesso: "",
    tipoSigla: "",
    codSIORG: "",
    orgaoSigla: "",
  });

  // Função para obter opções únicas de um campo
  const getUniqueOptions = (key: keyof DocumentData) => {
    const options = Array.from(new Set(documentsData.map(doc => String(doc[key])).filter(Boolean)));
    return options.sort().map(value => ({ value, label: value }));
  };

  // Memoize as opções para melhor performance
  const options = useMemo(() => ({
    status: getUniqueOptions("status"),
    tipo: getUniqueOptions("tipo"),
    nivelAcesso: getUniqueOptions("nivelAcesso"),
    orgao: Array.from(
      new Map(
        documentsData.map(doc => {
          const fullValue = `${doc.orgao}||${doc.orgaoSigla}`; // valor composto
          return [
            fullValue,
            {
              value: fullValue,
              label: `${doc.orgao} (${doc.orgaoSigla})`,
            }
          ];
        })
      ).values()
    ).sort((a, b) => a.label.localeCompare(b.label)),       
    setorResponsavel: getUniqueOptions("setorResponsavel"),
    tipoSigla: getUniqueOptions("tipoSigla"),
    orgaoSigla: getUniqueOptions("orgaoSigla"),
    codigo: getUniqueOptions("codigo"),
    titulo: getUniqueOptions("titulo"),
    id: getUniqueOptions("id"),
    codSIORG: getUniqueOptions("codSIORG"),
    ano: documentsData
      .map(doc => {
        const date = new Date(doc.dataDocumento);
        return date.getFullYear().toString();
      })
      .filter((year, index, self) => self.indexOf(year) === index)
      .sort()
      .map(year => ({ value: year, label: year }))
  }), [documentsData]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    let processedValue = value;
  
    // Quando o filtro é "orgao", extraia apenas a parte do nome antes do "||"
    if (key === "orgao" && value.includes("||")) {
      processedValue = value.split("||")[0];
    }
  
    console.log(`[Filtro] Campo: ${key}`);
    console.log(`[Filtro] Valor selecionado: ${value}`);
    console.log(`[Filtro] Valor processado: ${processedValue}`);
  
    const newFilters = { ...filters, [key]: processedValue };
    setFilters(newFilters);
    applyFilters(newFilters);
  };
  
  

  const applyFilters = (currentFilters: FilterState) => {
    let filtered = [...documentsData];

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "Todos") {
        filtered = filtered.filter(doc => {
          const docValue = (doc as any)[key]?.toString().toLowerCase() || "";
          const filterValue = value.toLowerCase();

          switch (key) {
            case "ano":
              const docYear = doc.dataDocumento ? new Date(doc.dataDocumento).getFullYear().toString() : "";
              return docYear === filterValue;
          
            case "orgao":
              const orgao = doc.orgao?.toLowerCase() || "";
              const orgaoSigla = doc.orgaoSigla?.toLowerCase() || "";
              console.log(orgao);
              return orgao.includes(filterValue) || orgaoSigla.includes(filterValue);
          
            default:
              return docValue.includes(filterValue);
          }
          
        });
      }
    });

    console.log('Aplicando filtros:', currentFilters);
    console.log('Documentos filtrados - teste:', filtered.length);
    onFiltersChange(filtered);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      status: "",
      codigo: "",
      tipo: "",
      titulo: "",
      id: "",
      orgao: "",
      setorResponsavel: "",
      ano: "",
      nivelAcesso: "",
      tipoSigla: "",
      codSIORG: "",
      orgaoSigla: ""
    };
    setFilters(emptyFilters);
    console.log('Limpando todos os filtros');
    onFiltersChange(documentsData);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/80 shadow-lg rounded-lg">
      <div className="border-b border-gray-200 p-4">
        <FilterHeader 
          activeFiltersCount={activeFiltersCount}
          onClearAllFilters={clearAllFilters}
        />
      </div>

      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-4">
          <ComboFilter
            label="Status"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            placeholder="Todos os status"
            options={options.status}
          />

          <ComboFilter
            label="Código"
            value={filters.codigo}
            onChange={(value) => handleFilterChange("codigo", value)}
            placeholder="Ex: REG-2024-001"
            options={options.codigo}
          />

          <ComboFilter
            label="Tipo"
            value={filters.tipo}
            onChange={(value) => handleFilterChange("tipo", value)}
            placeholder="Todos os tipos"
            options={options.tipo}
          />

          <ComboFilter
            label="Título"
            value={filters.titulo}
            onChange={(value) => handleFilterChange("titulo", value)}
            placeholder="Título do documento"
            options={options.titulo}
          />

          <ComboFilter
            label="ID"
            value={filters.id}
            onChange={(value) => handleFilterChange("id", value)}
            placeholder="ID do documento"
            options={options.id}
          />

          <ComboFilter
            label="Órgão ou Unidade"
            value={filters.orgao}
            onChange={(value) => handleFilterChange("orgao", value)}
            placeholder="Todos os órgãos"
            options={options.orgao}
          />

          <ComboFilter
            label="Setor Responsável"
            value={filters.setorResponsavel}
            onChange={(value) => handleFilterChange("setorResponsavel", value)}
            placeholder="Todos os setores"
            options={options.setorResponsavel}
          />

          <ComboFilter
            label="Ano"
            value={filters.ano}
            onChange={(value) => handleFilterChange("ano", value)}
            placeholder="Ex: 2024"
            options={options.ano}
          />

          <ComboFilter
            label="Nível de acesso"
            value={filters.nivelAcesso}
            onChange={(value) => handleFilterChange("nivelAcesso", value)}
            placeholder="Todos os níveis"
            options={options.nivelAcesso}
          />

          <ComboFilter
            label="Tipo (sigla)"
            value={filters.tipoSigla}
            onChange={(value) => handleFilterChange("tipoSigla", value)}
            placeholder="Todas as siglas de tipo"
            options={options.tipoSigla}
          />

          <ComboFilter
            label="CodSIORG"
            value={filters.codSIORG}
            onChange={(value) => handleFilterChange("codSIORG", value)}
            placeholder="Ex: 241375"
            options={options.codSIORG}
          />

          <ComboFilter
            label="Órgão ou Unidade (sigla)"
            value={filters.orgaoSigla}
            onChange={(value) => handleFilterChange("orgaoSigla", value)}
            placeholder="Todas as siglas de órgão"
            options={options.orgaoSigla}
          />
        </div>
      </div>
    </div>
  );
};
// Comentário forçado por Thaís para destravar PR com alterações reais nos filtros
export default ControlFilters;
