// Hook atualizado para usar integração direta com Google Sheets
// Agora funciona sem backend - acesso direto à planilha
export { useDirectGoogleSheets as useGoogleSheetsDocuments } from './useDirectGoogleSheets';
export type { DocumentData } from './useDirectGoogleSheets';
