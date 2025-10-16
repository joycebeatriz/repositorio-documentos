
// Função para sanitizar URLs
export const sanitizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Permitir apenas protocolos seguros
    if (!['http:', 'https:', 'mailto:'].includes(urlObj.protocol)) {
      return '#';
    }
    return url;
  } catch {
    return '#';
  }
};

// Função para sanitizar texto (prevenir XSS)
export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Função para validar entrada de busca
export const validateSearchInput = (input: string): boolean => {
  if (typeof input !== 'string') return false;
  if (input.length > 100) return false;
  // Bloquear scripts maliciosos
  const dangerousPatterns = /<script|javascript:|data:/i;
  return !dangerousPatterns.test(input);
};

// Função para validar dados de documento
export const validateDocumentData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = ['titulo', 'codigo', 'tipo'];
  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string') return false;
  }
  
  return true;
};
