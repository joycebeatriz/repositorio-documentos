import { useState, useEffect } from "react";
import DocumentControlPanel from "@/components/DocumentControlPanel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useGoogleSheetsDocuments } from "@/hooks/useGoogleSheetsDocuments";

interface Document {
  status: string;
  codigo: string;
  tipo: string;
  numero: string;
  titulo: string;
  epigrafe: string;
  id: string;
  assunto: string;
  orgao: string;
  setorResponsavel: string;
  dataDocumento: string;
  linkAcesso: string;
  nivelAcesso: string;
  localArquivo: string;
  observacao: string;
  tipoSigla: string;
  codSIORG: string;
  orgaoSigla: string;
}

export default function DocumentControl() {
  // Usar dados da planilha Google Sheets
  const { documents, loading, error } = useGoogleSheetsDocuments();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <DocumentControlPanel />
      <Footer />
    </div>
  );
}
