import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Calendar, Settings, BookOpen, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const DocumentTypesSection = () => {
  const documentTypes = [
    {
      type: "Regulamentos",
      description: "Normas e diretrizes institucionais",
      icon: BookOpen,
      count: "12",
      color: "bg-blue-100 text-blue-600",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      type: "Atas",
      description: "Registros de reuniões e deliberações",
      icon: Users,
      count: "45",
      color: "bg-green-100 text-green-600",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    },
    {
      type: "Circulares",
      description: "Comunicações e informes oficiais",
      icon: Calendar,
      count: "28",
              color: "bg-blue-100 text-blue-600",
        iconColor: "text-blue-600",
        borderColor: "border-blue-200"
    },
    {
      type: "POPs",
      description: "Procedimentos operacionais padrão",
      icon: Settings,
      count: "156",
      color: "bg-orange-100 text-orange-600",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200"
    },
    {
      type: "Resoluções",
      description: "Decisões e deliberações oficiais",
      icon: Shield,
      count: "89",
      color: "bg-red-100 text-red-600",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      type: "Portarias",
      description: "Atos administrativos e nomeações",
      icon: FileText,
      count: "109",
      color: "bg-yellow-100 text-yellow-600",
      iconColor: "text-rose-600",
      borderColor: "border-rose-200"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tipos de Documentos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {documentTypes.map((docType, index) => (
            <Card 
              key={index} 
              className={`${docType.color} ${docType.borderColor} border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${docType.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <docType.icon className={`w-6 h-6 ${docType.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {docType.type}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {docType.description}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-2xl font-bold ${docType.iconColor}`}>
                    {docType.count}
                  </span>
                  <span className="text-sm text-gray-500">documentos</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3">
              Ver Todos os Documentos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentTypesSection;
