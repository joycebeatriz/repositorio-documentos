
import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Shield } from "lucide-react";
import { DocumentData } from "@/types/document";
import { useDocumentStats } from "@/hooks/useDocumentStats";

interface StatsCardsProps {
  filteredDocuments: DocumentData[];
}

const StatsCards = ({ filteredDocuments }: StatsCardsProps) => {
  const { stats: documentStats } = useDocumentStats();
  
  // Usar estatísticas do backend (documentos únicos) quando disponíveis
  const totalDocuments = documentStats?.totalDocuments || filteredDocuments.length;
  
  // Calcular status baseado nas estatísticas do backend
  const getStatusCount = (statusKeywords: string[]) => {
    if (!documentStats?.statistics?.byStatus) {
      // Fallback para cálculo manual se estatísticas não estiverem disponíveis
      return filteredDocuments.filter(doc => 
        statusKeywords.some(keyword => doc.status?.toLowerCase().includes(keyword.toLowerCase()))
      ).length;
    }
    
    // Usar estatísticas do backend
    return Object.entries(documentStats.statistics.byStatus)
      .filter(([status, _]) => 
        statusKeywords.some(keyword => status.toLowerCase().includes(keyword.toLowerCase()))
      )
      .reduce((sum, [_, count]) => sum + (count as number), 0);
  };
  
  const pendingDocuments = getStatusCount(["em revisão", "pendente", "em análise", "rascunho"]);
  const approvedDocuments = getStatusCount(["ativo", "aprovado"]);

  console.log('Total de documentos (únicos):', totalDocuments);
  console.log('Em revisão/pendentes:', pendingDocuments);
  console.log('Ativos/aprovados:', approvedDocuments);

  const stats = [
    { 
      label: "Total de Documentos", 
      value: totalDocuments.toString(), 
      icon: FileText, 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-50 to-blue-100" 
    },
    { 
      label: "Em revisão", 
      value: pendingDocuments.toString(), 
      icon: Shield, 
      color: "text-orange-600", 
      bg: "bg-gradient-to-br from-orange-50 to-orange-100" 
    },
    { 
      label: "Ativos", 
      value: approvedDocuments.toString(), 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 ${stat.bg} rounded-xl shadow-md`}>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
