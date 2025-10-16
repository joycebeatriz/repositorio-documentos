
export interface DocumentData {
  id: string;
  status: string;
  codigo: string;
  tipo: string;
  numero: string;
  titulo: string;
  epigrafe: string;
  assunto: string;
  orgao: string;
  setor: string;
  setorResponsavel: string;
  setoresArray: string[]; // Array de setores para busca
  dataDocumento: string;
  linkAcesso: string;
  nivelAcesso: string;
  localArquivo: string;
  observacao: string;
  tipoSigla: string;
  codSIORG: string;
  orgaoSigla: string;
  // Campos adicionais para compatibilidade
  orgaoUnidade?: string;
  orgaoUnidadeSigla?: string;
}

export interface PublicDocumentData {
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
