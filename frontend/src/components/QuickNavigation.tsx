
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Search, Settings, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const QuickNavigation = () => {
  const quickActions = [
    {
      title: "Busca Rápida",
      description: "Encontre documentos instantaneamente",
      icon: Search,
      action: "Pesquisar Agora",
      link: "/",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Documentos Recentes",
      description: "Acesse os últimos documentos publicados",
      icon: TrendingUp,
      action: "Ver Recentes",
      link: "/",
      color: "bg-emerald-50",
      iconColor: "text-emerald-600",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      title: "Área Administrativa",
      description: "Gerencie e controle documentos",
      icon: Settings,
      action: "Acessar Controle",
      link: "/controle",
              color: "bg-blue-50",
        iconColor: "text-blue-600",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-br from-slate-50 to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Rápido
          </h2>
          <p className="text-gray-600">
            Navegue diretamente para as funcionalidades mais utilizadas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${action.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {action.description}
                </p>
                
                <Link to={action.link}>
                  <Button 
                    size="sm" 
                    className={`w-full ${action.buttonColor} text-white group-hover:shadow-lg transition-all duration-300`}
                  >
                    {action.action}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickNavigation;
