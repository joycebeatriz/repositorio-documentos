import { FC } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DocumentDownloadButtonProps {
  fileName: string;
  title: string;
  epigrafe: string;
  linkAcesso?: string;
}

const DocumentDownloadButton: FC<DocumentDownloadButtonProps> = ({
  fileName,
  title,
  epigrafe,
  linkAcesso,
}) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    console.log("Iniciando download...");
    console.log("Link de acesso:", linkAcesso);
    console.log("Nome do arquivo:", fileName);

    try {
      if (linkAcesso) {
        // Corrige links do Google Drive
        let finalURL = linkAcesso;
        const driveMatch = linkAcesso.match(
          /https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/
        );
        if (driveMatch && driveMatch[1]) {
          finalURL = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
          console.log("Link convertido para download direto:", finalURL);
        }

        // Tenta baixar o arquivo
        try {
          const response = await fetch(finalURL, {
            method: "GET",
            mode: "cors",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName || "documento.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } catch (fetchError) {
          // Fallback: abre o link
          const a = document.createElement("a");
          a.href = finalURL;
          a.download = fileName || "documento.pdf";
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      } else {
        // Cria texto se não houver link
        const content = `Documento: ${title}\nEpígrafe: ${epigrafe}\n\nConteúdo do material...`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || "documento.txt";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }

      toast({
        title: "Download iniciado",
        description: `O download do documento "${title}" foi iniciado.`,
      });
    } catch (error) {
      console.error("Erro geral no download:", error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o documento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Baixar documento"
      onClick={handleDownload}
      className="text-muted-foreground hover:text-primary"
    >
      <Download size={20} />
    </Button>
  );
};

export default DocumentDownloadButton;
