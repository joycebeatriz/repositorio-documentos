import { useState, useEffect } from 'react';
import { useGoogleSheetsDocuments } from './useGoogleSheetsDocuments';

interface PublicDocumentData {
  titulo: string;
  epigrafe: string;
  tipo: string;
  orgao: string;
  setor: string;
  status: string;
  publicoAlvo: string;
  id: number;
  tipoSigla: string;
  numero: number;
  orgaoSigla: string;
  assunto: string;
  linkAcesso?: string;
  dataPublicacao?: string;
}

// Função para converter data do formato DD/MM/YYYY para objeto Date
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

export const usePublicDocuments = () => {
  const { documents: googleSheetsDocs, loading, error } = useGoogleSheetsDocuments();
  const [documents, setDocuments] = useState<PublicDocumentData[]>([]);

  useEffect(() => {
    // Mapear dados da planilha Google Sheets para a interface PublicDocumentData
    const mappedDocuments = googleSheetsDocs.map((doc: any) => { 
      const docWithSynthesizedData: PublicDocumentData = {
        titulo: doc.titulo,
        epigrafe: doc.epigrafe,
        tipo: doc.tipo,
        orgao: doc.orgao,
        setor: doc.setor || doc.setorResponsavel,
        status: doc.status,
        publicoAlvo: doc.setorResponsavel || 'Público Geral',
        id: parseInt(doc.id) || 0,
        tipoSigla: doc.tipoSigla,
        numero: parseInt(doc.numero) || 0,
        orgaoSigla: doc.orgaoSigla,
        assunto: doc.assunto,
        linkAcesso: doc.linkAcesso,
        dataPublicacao: doc.dataDocumento ? doc.dataDocumento.split(' ')[0] : "01/01/2023",
      };
      return docWithSynthesizedData;
    });

    // Ordenar documentos por título (alfabético)
    const sortedDocuments = mappedDocuments.sort((a, b) => {
      return a.titulo.localeCompare(b.titulo);
    });
    
    setDocuments(sortedDocuments);
  }, [googleSheetsDocs]);

  return {
    documents,
    setDocuments,
    loading,
    error
  };
};

export type { PublicDocumentData };
