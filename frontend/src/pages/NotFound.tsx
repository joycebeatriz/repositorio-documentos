
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, FileQuestion, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30 flex items-center justify-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-72 h-72 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-4">
        <Card className="bg-white/90 backdrop-blur-lg border border-white/60 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Ícone de erro */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-8 relative">
              <FileQuestion className="w-12 h-12 text-red-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Título de erro */}
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
              404
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Página não encontrada
            </h2>
            
            <p className="text-slate-600 text-base md:text-lg mb-2 leading-relaxed">
              A página que você está procurando não existe ou foi movida.
            </p>
            
            <p className="text-slate-500 text-sm mb-8">
              Caminho tentado: <code className="bg-slate-100 px-2 py-1 rounded text-xs">{location.pathname}</code>
            </p>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="h-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Home className="w-5 h-5 mr-2" />
                  Ir para Home
                </Button>
              </Link>
              
              <Button 
                onClick={() => window.history.back()}
                variant="outline" 
                className="h-12 px-6 border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            </div>

            {/* Links úteis */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-slate-500 text-sm mb-4">Ou acesse diretamente:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link 
                  to="/" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
                >
                  Consultar Documentos
                </Link>
                <span className="text-slate-300">•</span>
                <Link 
                  to="/controle" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
                >
                  Controle de Documentos
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
