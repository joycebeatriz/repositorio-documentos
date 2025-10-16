import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentActionsProps {
  linkAcesso: string;
  titulo: string;
}

const DocumentActions = ({ linkAcesso, titulo }: DocumentActionsProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: `Download do documento "${titulo}" foi iniciado.`,
    });
  };

  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
      {/* Botão de download removido conforme solicitado */}
    </div>
  );
};

export default DocumentActions;
