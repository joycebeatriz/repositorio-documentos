// src/pages/DocumentQuery.tsx
import DocumentSearchPanel from "@/components/DocumentSearchPanel";
import ChartsSection from "@/components/ChartsSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useScrollToSection } from "@/hooks/useScrollToSection";


const DocumentQuery = () => {
  const [searchParams] = useSearchParams();
  const tipoParam = searchParams.get('tipo');
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollToSection } = useScrollToSection();

  // Performance optimization: lazy loading and intersection observer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoized initial filter for performance
  const initialFilter = useMemo(() => 
    tipoParam ? { tipo: tipoParam } : undefined, 
    [tipoParam]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/30">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden" role="banner" aria-labelledby="hero-title">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-100/50"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        
        <div className="relative max-w-2xl mx-auto px-2 pt-0 pb-8">
          <div className="text-center">
            {/* Main Heading - Redesigned */}
            <div className="mb-4">
              
              <h1 id="hero-title" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Documentos Padronizados UFG
                </span>
              </h1>
              
              {/* Enhanced Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-2">
                Busque documentos da UFG de forma rápida.
              </p>
            </div>



          </div>
        </div>

      </section>


      {/* Search Section - Main Focus */}
      <section id="search-section" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100" role="region" aria-labelledby="search-title">
        <div className="w-full">
          <DocumentSearchPanel initialFilter={initialFilter} />
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats-section" className="py-12" role="region" aria-labelledby="stats-title">
      <ChartsSection />
      </section>

      <Footer />
    </div>
  );
};

export default DocumentQuery;