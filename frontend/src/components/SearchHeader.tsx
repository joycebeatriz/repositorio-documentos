import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Settings, FileText } from "lucide-react";

const SearchHeader = () => {
  const location = useLocation();

  const navItems = [
    {
      label: "Consulta documentos",
      path: "/",
      icon: Search,
    },
    {
      label: "Area de controle",
      path: "/controle",
      icon: Settings,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Menu */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-2xl">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Consulta de Documentos Padronizados
          </h1>
          
          <p className="text-gray-500 max-w-2xl mx-auto">
            Encontre documentos institucionais usando filtros avançados e busca por texto
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>5.847 documentos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sistema atualizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
