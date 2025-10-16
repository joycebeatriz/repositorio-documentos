
interface DocumentData {
  codigo: string;
  numero: string;
  id: string;
  assunto: string;
  dataDocumento: string;
  orgaoUnidade: string;
  setorResponsavel: string;
  nivelAcesso: string;
  tipoSigla: string;
  codSIORG: string;
  orgaoUnidadeSigla: string;
  localArquivo: string;
  linkAcesso: string;
  observacao: string;
}

interface DocumentInfoProps {
  document: DocumentData;
}

const DocumentInfo = ({ document }: DocumentInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="codigo-label">
            Código
          </label>
          <p className="text-sm text-slate-900 font-medium" aria-labelledby="codigo-label">
            {document.codigo}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="numero-label">
            Número
          </label>
          <p className="text-sm text-slate-900" aria-labelledby="numero-label">
            {document.numero}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="id-label">
            ID
          </label>
          <p className="text-sm text-slate-900" aria-labelledby="id-label">
            {document.id}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="assunto-label">
            Assunto
          </label>
          <p className="text-sm text-slate-900" aria-labelledby="assunto-label">
            {document.assunto}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="data-label">
            Data do Documento
          </label>
          <p className="text-sm text-slate-900" aria-labelledby="data-label">
            {document.dataDocumento}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="orgao-label">
            Órgão ou Unidade
          </label>
          <p className="text-sm text-slate-900 font-medium" aria-labelledby="orgao-label">
            {document.orgaoUnidade}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="setor-label">
            Setor Responsável
          </label>
          <p className="text-sm text-slate-900" aria-labelledby="setor-label">
            {document.setorResponsavel}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="acesso-label">
            Nível de Acesso
          </label>
          <p className="text-sm text-slate-900" aria-labelledby="acesso-label">
            {document.nivelAcesso}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="sigla-label">
            Tipo (Sigla)
          </label>
          <p className="text-sm text-slate-900" aria-labelledby="sigla-label">
            {document.tipoSigla}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" id="siorg-label">
            CodSIORG
          </label>
          <p className="text-sm text-slate-900" aria-labelledby="siorg-label">
            {document.codSIORG}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;
