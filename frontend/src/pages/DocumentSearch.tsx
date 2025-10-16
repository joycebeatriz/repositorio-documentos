import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import DocumentTypesSection from '../components/DocumentTypesSection';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';

const DocumentSearch = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HERO */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
            Consulta de Documentos Padronizados
          </h1>
          <p className="mt-3 text-gray-600 text-lg">Acesse facilmente documentos padronizados da UFG.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Link to="/" aria-label="Consultar documentos">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md">
                <Search className="w-5 h-5 mr-2" /> Consultar Documentos <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <DocumentTypesSection />
      <Footer />
    </div>
  );
};

export default DocumentSearch;
