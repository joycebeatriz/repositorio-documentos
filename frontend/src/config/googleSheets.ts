// Configurações do Google Sheets para acesso direto
// Este arquivo contém as configurações necessárias para acessar a planilha diretamente

export const GOOGLE_SHEETS_CONFIG = {
  // API Key pública do Google Sheets (apenas leitura)
  // Usar variáveis de ambiente em produção
  API_KEY: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || 'AIzaSyADQAVJ0SnvTI1Syl-0Bzb_2Z_JbsA2yWU',
  
  // ID da planilha do Google Sheets
  SPREADSHEET_ID: import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID || '16sEH74w9t5VN8iyLwIe_xmt4azTXmoIV-R2cfZ2L5Rw',
  
  // Range da planilha (aba e colunas)
  RANGE: import.meta.env.VITE_GOOGLE_SHEETS_RANGE || 'Lista!A1:AE1000',
  
  // URL base da API do Google Sheets
  API_URL: 'https://sheets.googleapis.com/v4/spreadsheets'
};

// Função para construir URL completa da API
export const buildSheetsUrl = (endpoint: string = '') => {
  return `${GOOGLE_SHEETS_CONFIG.API_URL}/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/${endpoint}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
};

// Função para construir URL de valores da planilha
export const buildValuesUrl = () => {
  return `${GOOGLE_SHEETS_CONFIG.API_URL}/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
};

// Função para verificar se as configurações estão corretas
export const validateConfig = () => {
  const issues = [];
  
  if (!GOOGLE_SHEETS_CONFIG.API_KEY) {
    issues.push('API Key não configurada');
  }
  
  if (!GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID) {
    issues.push('ID da planilha não configurado');
  }
  
  if (!GOOGLE_SHEETS_CONFIG.RANGE) {
    issues.push('Range da planilha não configurado');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};
