import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, X } from "lucide-react";
import Fuse from 'fuse.js';

interface ComboFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string; }[];
}

const ComboFilter = ({ label, value, onChange, placeholder, options }: ComboFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Configurar Fuse.js para busca fuzzy
  const fuse = useMemo(() => {
    return new Fuse(options, {
      keys: ['label', 'value'],
      threshold: 0.3,
      distance: 100,
      includeScore: true,
      shouldSort: true,
    });
  }, [options]);

  // Melhorar o evento de click fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    // Adicionar listeners apenas quando dropdown está aberto
    if (isOpen) {
      // Usar capture: true para garantir que o evento seja capturado
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('touchstart', handleClickOutside, true);
      
      // Também adicionar listener para scroll
      document.addEventListener('scroll', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
      document.removeEventListener('scroll', handleClickOutside, true);
    };
  }, [isOpen]);

  // Filtrar opções com busca fuzzy otimizada
  const filteredOptions = useMemo(() => {
    const term = searchTerm || value;
    if (!term || term.trim() === "") {
      return options.slice(0, 50); // Limitar a 50 itens iniciais para performance
    }
    
    const fuzzyResults = fuse.search(term);
    
    console.log(`[Fuzzy] Termo buscado: "${term}"`);
    
    console.log("[Fuzzy] Resultados fuzzy:", fuzzyResults.map(r => r.item));


    // Se encontrou resultados fuzzy, usar eles
    if (fuzzyResults.length > 0) {
      return fuzzyResults
        .slice(0, 30) // Limitar resultados para performance
        .map(result => result.item);
    }
    
    // Fallback para busca simples se fuzzy não encontrou nada
    const lowercaseTerm = term.toLowerCase();
    return options
      .filter(option =>
        option.label.toLowerCase().includes(lowercaseTerm) ||
        option.value.toLowerCase().includes(lowercaseTerm)
      )
      .slice(0, 30);
  }, [searchTerm, value, options, fuse]);

  // Encontrar label para o valor atual
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || value;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log(`[Busca] Campo "${label}" digitado: ${newValue}`);
    onChange(newValue);
    setSearchTerm(newValue);
    setIsOpen(true);
  };

  const handleOptionSelect = (optionValue: string, optionLabel: string) => {
    onChange(optionValue);
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (value && !searchTerm) {
      setSearchTerm(value);
    }
  };

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) {
      inputRef.current?.focus();
      if (value && !searchTerm) {
        setSearchTerm(value);
      }
    }
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative group">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-2 pr-16 transition-all duration-200 group-hover:border-gray-400"
        />
        
        <div className="absolute right-1 top-1 flex items-center gap-1">
          {value && value.trim() !== "" && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all duration-200"
              aria-label="Limpar filtro"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleDropdown}
            className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all duration-200"
            aria-label="Abrir opções"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Indicador visual de filtro ativo */}
        {value && value.trim() !== "" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
        )}

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden backdrop-blur-sm">
            
            {/* Lista de opções com scroll customizado */}
            <div className="max-h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="py-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <button
                      key={`${option.value}-${index}`}
                      type="button"
                      onClick={() => handleOptionSelect(option.value, option.label)}
                                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:text-blue-700 focus:bg-gradient-to-r focus:from-blue-50 focus:to-blue-50 focus:text-blue-700 focus:outline-none transition-all duration-200 border-l-2 border-transparent hover:border-blue-400 ${
              value === option.value ? 'bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 font-medium border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {value === option.value && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <div className="text-sm text-gray-500 mb-1">
                      Nenhuma opção encontrada
                    </div>
                    {searchTerm && (
                      <div className="text-xs text-gray-400">
                        para "{searchTerm}"
                      </div>
                    )}
                    <div className="text-xs text-blue-500 mt-2">
                      Tente usar termos mais gerais
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer com informações melhoradas */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {filteredOptions.length} de {options.length} opções
                
              </div>
              {searchTerm && (
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                  Busca ativa
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboFilter;
