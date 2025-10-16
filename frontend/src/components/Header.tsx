import { Link, useLocation } from "react-router-dom";
import { Search, Settings, Menu, X, FileText, Home, ChevronUp, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SyncStatus } from "@/components/SyncStatus";
import { useScrollToSection } from "@/hooks/useScrollToSection";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { scrollToSection } = useScrollToSection();

  // Função para scroll suave ao topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Função para ir à seção de busca
  const goToSearch = () => {
    scrollToSection('search-section', 80); // 80px de offset para compensar o header fixo
  };

  // Função para ir à seção de estatísticas
  const goToStats = () => {
    scrollToSection('stats-section', 80); // 80px de offset para compensar o header fixo
  };

  // Detectar scroll para mostrar/esconder botão
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      label: "Início",
      action: scrollToTop,
      icon: Home,
      description: "Voltar ao topo"
    },
    {
      label: "Consultar documentos",
      action: goToSearch,
      icon: Search,
      description: "Buscar documentos"
    },
    {
      label: "Dados Estatísticos",
      action: goToStats,
      icon: BarChart3,
      description: "Ver gráficos e estatísticas"
    },
    /*
    {
      label: "Controle de documentos",
      path: "/controle",
      icon: Settings,
      description: "Gerenciar documentos"
    },*/
  ];

  // Para landing page, não precisamos de currentPage baseado em path
  const currentPage = null;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-md">
        <nav className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-12">
          <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
            
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center gap-1 sm:gap-2 group shrink-0">
              <img src="/logo_secplan.png" alt="Logo Secplan" className="w-48 h-48 object-contain" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className={cn(
                      "flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                      "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Botão Scroll to Top */}
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className={cn(
                  "ml-2 transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900",
                  showScrollToTop ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                title="Voltar ao topo"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              
              {/* Sync Status */}
              <div className="ml-2 pl-4 border-l border-gray-200">
                <SyncStatus />
              </div>
            </div>

            {/* Mobile/Tablet menu button */}
            <div className="lg:hidden flex items-center gap-2">
              {currentPage && (
                <div className="text-right hidden xs:block">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">{currentPage.label}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">{currentPage.description}</div>
                </div>
              )}
              
              {/* Botão Scroll to Top Mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900",
                  showScrollToTop ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                title="Voltar ao topo"
              >
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMobileMenu}
                className="w-8 h-8 sm:w-10 sm:h-10 border hover:bg-gray-50"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="px-2 sm:px-4 py-3 space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-300 w-full",
                      "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                    )}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="flex-1 text-left">
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

    </>
  );
};

export default Header;
