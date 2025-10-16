import { useState, useEffect, useMemo, useRef } from 'react';
import { Building2 } from 'lucide-react';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { useDocumentStats } from '@/hooks/useDocumentStats';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { useGoogleSheetsDocuments, DocumentData } from '@/hooks/useGoogleSheetsDocuments';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// --- Tipagem mínima para os documentos do Google Sheets ---
type PublicDoc = DocumentData;

const TYPE_META: Record<string, { label: string; displayName: string; color: string }> = {
  CV:   { label: 'CV',   displayName: 'Cadeia de Valor',                 color: '#6ee7b7' }, // emerald-300
  MAN:  { label: 'MAN',  displayName: 'Manual',                          color: '#fbbf24' }, // amber-400
  MOD:  { label: 'MOD',  displayName: 'Modelagem de Processos',          color: '#c4b5fd' }, // violet-300
  POP:  { label: 'POP',  displayName: 'Procedimento Operacional Padrão', color: '#60a5fa' }, // blue-400
  IT:   { label: 'IT',   displayName: 'Instrução de Trabalho',           color: '#f87171' }, // red-400
  VID:  { label: 'VID',  displayName: 'Vídeo',                           color: '#c084fc' }, // purple-400
  CAT:  { label: 'CAT',  displayName: 'Catálogo de Serviços',            color: '#fb923c' }, // orange-400
};

function normalizeTypeSigla(s?: string) {
  const normalized = (s ?? '').trim().toUpperCase().replace(/\s+/g, '');
  
  // Mapear variações para POP
  if (normalized.includes('PROCEDIMENTOOPERACIONALPADRAO') || 
      normalized.includes('PROCEDIMENTOOPERACIONALPADRÃO') ||
      normalized.includes('PROCEDIMENTOOPERACIONALPADRAO')) {
    return 'POP';
  }
  
  return normalized;
}

const OTHER_SECTOR_LABEL = 'Outra Unidade';

// Preferência de campos para setor: setor > orgao > orgaoSigla > publicoAlvo
function resolveSector(doc: PublicDoc): string {
  const s =
    (doc.orgao ?? '')
      .toString()
      .trim();
  return s || OTHER_SECTOR_LABEL;
}

// Remove acentos e normaliza minúsculas
function normalizeStr(s?: string) {
  return (s ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Mapeia variações para os 3 grupos do donut
function normalizeStatus(raw?: string): 'Ativos' | 'Em Revisão' | 'Inativos' {
  const s = normalizeStr(raw);

  // ativos: "Ativo", "Ativos", "Vigente" etc.
  if (/^ativo(s)?$/.test(s) || s.includes('vigent')) return 'Ativos';

  // revisão: "Em Revisão", "Revisão", "Revisao"
  if (s.includes('revis')) return 'Em Revisão';

  // inativos (guarda-chuva): "Inativo", "Inativado", "Arquivado", "Obsoleto", "Cancelado", "Revogado", etc.
  const inactiveHints = ['inativ', 'arquiv', 'obsolet', 'cancel', 'revog'];
  if (inactiveHints.some((h) => s.includes(h))) return 'Inativos';

  // fallback conservador
  return 'Inativos';
}

/* ===================== PLUGINS ===================== */
const donutTrackPlugin = {
  id: 'donutTrack',
  beforeDatasetsDraw(chart: any, _args: any, pluginOptions: any) {
    const meta = chart.getDatasetMeta(0);
    const arc = meta?.data?.[0];
    if (!arc) return;
    const { ctx } = chart;
    const { x, y, innerRadius, outerRadius } = arc;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
    ctx.arc(x, y, innerRadius, Math.PI * 2, 0, true);
    ctx.fillStyle = pluginOptions?.color || '#eef2ff';
    ctx.fill();
    ctx.restore();
  },
};

const arcLabelsPlugin = {
  id: 'arcLabels',
  afterDatasetDraw(chart: any, args: any) {
    if (args.index !== 0) return;
    const { ctx, data } = chart;
    const meta = chart.getDatasetMeta(0);
    const ds = data.datasets[0];
    const total = ds.data.reduce((a: number, b: number) => a + b, 0);
    const enabled = (chart?.options as any)?.plugins?.arcLabels;
    if (enabled === false) return;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 11px Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.fillStyle = '#0f172a';

    meta.data.forEach((arc: any, i: number) => {
      const value = ds.data[i];
      const pct = (value / total) * 100;
      if (pct < 8) return;
      const angle = (arc.startAngle + arc.endAngle) / 2;
      const r = (arc.outerRadius + arc.innerRadius) / 2;
      const x = arc.x + Math.cos(angle) * r;
      const y = arc.y + Math.sin(angle) * r;
      ctx.fillText(`${Math.round(pct)}%`, x, y);
    });

    ctx.restore();
  },
};

ChartJS.register(donutTrackPlugin as any, arcLabelsPlugin as any);

/* ===== Tooltips externos melhorados ===== */
function externalRadialTooltipFactory(className: string) {
  return function externalRadialTooltip(context: any) {
    const { chart, tooltip } = context;

    const canvasParent = chart.canvas?.parentNode as HTMLElement;
    const bigParent =
      className.includes('status')
        ? (canvasParent?.parentElement as HTMLElement) || canvasParent
        : canvasParent;

    if (!bigParent) return;

    let el = bigParent.querySelector<HTMLDivElement>(`.${className}`);
    if (!el) {
      el = document.createElement('div');
      el.className =
        `${className} pointer-events-none select-none absolute z-30 rounded-xl bg-white/98 backdrop-blur-sm shadow-2xl ring-1 ring-black/5 px-4 py-3`;
      el.style.transition = 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.opacity = '0';
      el.style.transform = 'scale(0.95) translateY(4px)';
      el.style.whiteSpace = 'nowrap';
      el.style.maxWidth = '200px';
      bigParent.appendChild(el);
    }

    if (tooltip.opacity === 0) {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.95) translateY(4px)';
      return;
    }

    // conteúdo melhorado
    let labelText = '';
    let valueText = '';
    let pctText = '';
    let descriptionText = '';
    
    if (tooltip.body && tooltip.dataPoints?.length) {
      const dp = tooltip.dataPoints[0];
      labelText = dp.label ?? '';
      valueText = dp.formattedValue ?? '';
      
      try {
        const raw = dp.raw as number;
        const total = (dp.dataset.data as number[]).reduce((a, b) => a + b, 0);
        const p = (raw / total) * 100;
        pctText = className.includes('types')
          ? (p < 1 ? `${p.toFixed(2)}%` : `${Math.round(p)}%`)
          : `${Math.round(p)}%`;
      } catch {}
      
      // Adicionar descrição para tipos de documento
      if (className.includes('types')) {
        const typeKey = labelText.toUpperCase();
        const typeMeta = TYPE_META[typeKey];
        if (typeMeta) {
          descriptionText = typeMeta.displayName;
        }
      }
      
      el.innerHTML = `
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 rounded-full" style="background-color: ${dp.element?.options?.backgroundColor || '#3b82f6'}"></div>
          <div class="font-semibold text-sm text-gray-900">${labelText}</div>
        </div>
        <div class="text-xs text-gray-600 mb-1">${valueText} documentos</div>
        <div class="text-xs font-medium text-blue-600">${pctText} do total</div>
        ${descriptionText ? `<div class="text-xs text-gray-500 mt-1 italic">${descriptionText}</div>` : ''}
      `;
    }

    // posicionamento melhorado
    const canvasRect = (chart.canvas as HTMLCanvasElement).getBoundingClientRect();
    const parentRect = bigParent.getBoundingClientRect();

    const dp0 = tooltip.dataPoints?.[0];
    const elArc = dp0?.element;
    if (!elArc) {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.95) translateY(4px)';
      return;
    }

    const centerX = (elArc.x ?? 0) + (canvasRect.left - parentRect.left);
    const centerY = (elArc.y ?? 0) + (canvasRect.top - parentRect.top);

    if (className.includes('status')) {
      // donut: sempre à esquerda do círculo
      const outer = elArc.outerRadius || 0;
      const gap = 20;
      const { offsetWidth: w, offsetHeight: h } = el;
      const leftEdge = centerX - outer;
      const targetRight = leftEdge - gap;
      const mid = ((elArc.startAngle ?? 0) + (elArc.endAngle ?? 0)) / 2;

      let x = targetRight - w;
      let y = centerY + Math.sin(mid) * (outer * 0.25) - h / 2;

      const pad = 12;
      const maxX = bigParent.clientWidth - w - pad;
      const maxY = bigParent.clientHeight - h - pad;
      x = Math.max(pad, Math.min(x, maxX));
      y = Math.max(pad, Math.min(y, maxY));

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.opacity = '1';
      el.style.transform = 'scale(1) translateY(0)';
      return;
    }

    // pizza: ao redor da fatia com posicionamento inteligente
    const caretX = (tooltip.caretX ?? 0) + (canvasRect.left - parentRect.left);
    const caretY = (tooltip.caretY ?? 0) + (canvasRect.top - parentRect.top);
    const outer = elArc.outerRadius || 0;
    const angle = Math.atan2(caretY - centerY, caretX - centerX);
    const baseRadius = outer + 24;

    let x = centerX + Math.cos(angle) * baseRadius - el.offsetWidth / 2;
    let y = centerY + Math.sin(angle) * baseRadius - el.offsetHeight / 2;

    const pad = 12;
    const maxX = bigParent.clientWidth - el.offsetWidth - pad;
    const maxY = bigParent.clientHeight - el.offsetHeight - pad;
    x = Math.max(pad, Math.min(x, maxX));
    y = Math.max(pad, Math.min(y, maxY));

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.opacity = '1';
    el.style.transform = 'scale(1) translateY(0)';
  };
}

const externalDonutTooltip = externalRadialTooltipFactory('status-tooltip');
const externalPieTooltip = externalRadialTooltipFactory('types-tooltip');

const ChartsSection = () => {
  const { documents: publicDocumentsData, loading, error } = useGoogleSheetsDocuments();
  const { stats: documentStats, loading: statsLoading, error: statsError } = useDocumentStats();
  
  // Sistema funciona APENAS com dados da planilha Google Sheets
  // NÃO usar fallback para dados locais
  const documentsToUse = publicDocumentsData;
  
  /* ===== Constantes ===== */
  const HOVER_OFFSET = 14;
  const CHART_SAFE_PAD = Math.max(28, HOVER_OFFSET + 14);

  /* ====== Donut (status geral) — valores DINÂMICOS do Google Sheets ====== */
  const statusLabels: string[] = ['Ativos', 'Em Revisão', 'Inativos'];
  const statusColors: string[] = ['#3b82f6', '#facc15', '#ef4444'];
  const [statusHover, setStatusHover] = useState<number | null>(null);

  // Usar estatísticas do backend (documentos únicos)
  const statusValues = useMemo<number[]>(() => {
    if (!documentStats?.statistics?.byStatus) {
      return [0, 0, 0];
    }

    const counts: Record<(typeof statusLabels)[number], number> = {
      Ativos: 0,
      'Em Revisão': 0,
      Inativos: 0,
    };

    // Mapear estatísticas do backend para os buckets
    Object.entries(documentStats.statistics.byStatus).forEach(([status, count]) => {
      const bucket = normalizeStatus(status);
      counts[bucket] += count as number;
    });

    return statusLabels.map((lbl) => counts[lbl]);
  }, [documentStats]);

  const statusTotal = useMemo(
    () => documentStats?.totalDocuments || 0,
    [documentStats]
  );

  const statusPieData: ChartData<'doughnut', number[], string> ={
    labels: statusLabels,
    datasets: [
      {
        data: statusValues,
        backgroundColor: statusColors,
        borderWidth: 0,
        borderRadius: 12,
        spacing: 3,
        hoverOffset: HOVER_OFFSET,
      },
    ],
  };

  const statusPieOptions: ChartOptions<'doughnut'> = {
    cutout: '80%',
    rotation: -90,
    interaction: { mode: 'nearest', intersect: true },
    layout: { padding: { top: CHART_SAFE_PAD, right: CHART_SAFE_PAD, bottom: CHART_SAFE_PAD, left: CHART_SAFE_PAD } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false, external: externalDonutTooltip },
      donutTrack: { color: '#eef2ff' },
      arcLabels: false,
    },
    elements: { arc: { borderWidth: 0 } },
    animation: { duration: 450, easing: 'easeOutQuart', animateRotate: true, animateScale: false },
    maintainAspectRatio: false,
    responsive: true,
    onHover: (_evt: any, elements: any[], chart: any) => {
      if (elements && elements.length) {
        setStatusHover(elements[0].index);
        chart.canvas.style.cursor = 'pointer';
      } else {
        setStatusHover(null);
        chart.canvas.style.cursor = 'default';
      }
    },
  };

  /* ---------- Setores (DINÂMICO via Google Sheets) ---------- */
  // Usar estatísticas do backend (documentos únicos)
  const sectorEntries = useMemo(() => {
    if (!documentStats?.statistics?.bySetor) {
      return [];
    }

    // Transformar estatísticas do backend em array ordenado
    const arr = Object.entries(documentStats.statistics.bySetor)
      .map(([label, value]) => ({ label, value: value as number }))
      .sort((a, b) => b.value - a.value);

    return arr;
  }, [documentStats]);

  // Top 10 setores para gráfico
  const topSectors = useMemo(() => sectorEntries.slice(0, 10), [sectorEntries]);

  // Dados do gráfico de barras para top 10 setores - Design consistente
  const sectorsBarData = useMemo(() => ({
    labels: topSectors.map((_, index) => `Setor ${index + 1}`), // Labels simples para tooltip
    datasets: [{
      label: 'Documentos',
      data: topSectors.map(s => s.value),
      backgroundColor: [
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
        '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b'
      ],
      borderColor: [
        '#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3',
        '#db2777', '#e11d48', '#dc2626', '#ea580c', '#d97706'
      ],
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
    }]
  }), [topSectors]);

  const activeSectors = useMemo(() => sectorEntries.length, [sectorEntries]);

  // Parâmetros visuais
  const CATEGORY_PCT = 0.7;
  const BAR_PCT = 0.95;
  const BORDER_RADIUS = 12;

  // Dataset do gráfico de barras
  const sectorBarData = {
    labels: sectorEntries.map((s) => s.label),
    datasets: [
      {
        data: sectorEntries.map((s) => s.value),
        backgroundColor: '#3b82f6',
        borderRadius: BORDER_RADIUS,
        categoryPercentage: CATEGORY_PCT,
        barPercentage: BAR_PCT,
        borderWidth: 0,
        barThickness: 22,
        maxBarThickness: 28,
      } as any,
    ],
  };

  const sectorBarOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 6, right: 0, bottom: 0, left: 0 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (items: any[]) => (items?.length ? items[0].label : ''),
          label: (ctx: any) => `${ctx.raw} documentos`,
        },
      },
    },
    interaction: { mode: 'nearest', intersect: true },
    scales: {
      x: { display: false, grid: { display: false }, offset: true },
      y: { display: false, grid: { display: false }, beginAtZero: true, min: 0 },
    },
  };

  /* ---------- Pizza "Distribuição por título" (DINÂMICO) ---------- */
  const typesChartRef = useRef<any>(null);

  // Usar estatísticas do backend (documentos únicos) com fallback
  const typesAgg = useMemo(() => {
    if (documentStats?.statistics?.byType) {
      // Usar estatísticas do backend
      const arr = Object.entries(documentStats.statistics.byType)
        .map(([key, count]) => {
          const meta = TYPE_META[key] ?? { label: key, displayName: key, color: '#cbd5e1' };
          return { key, ...meta, count: count as number };
        })
        .sort((a, b) => b.count - a.count);
      return arr;
    }

    // Fallback: calcular dos documentos originais
    const counts = new Map<string, number>();
    (documentsToUse as PublicDoc[]).forEach((doc) => {
      const key = normalizeTypeSigla(doc.tipoSigla || doc.tipo);
      if (!key) return;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    const arr = Array.from(counts.entries()).map(([key, value]) => {
      const meta = TYPE_META[key] ?? { label: key, displayName: key, color: '#cbd5e1' };
      return { key, ...meta, count: value };
    });
    arr.sort((a, b) => b.count - a.count);
    
    // Debug: verificar se as siglas estão corretas
    console.log('🔍 TypesAgg debug:', arr.map(t => ({ key: t.key, label: t.label, displayName: t.displayName })));
    
    return arr;
  }, [documentStats, documentsToUse]);

  const typesPieData = useMemo(
    () => ({
      labels: typesAgg.map((t) => t.displayName),         // usado nos tooltips
      datasets: [
        {
          data: typesAgg.map((t) => t.count),
          backgroundColor: typesAgg.map((t) => t.color),
          borderWidth: 0,
          hoverOffset: HOVER_OFFSET,
          spacing: 2,
        },
      ],
    }),
    [typesAgg]
  );

  const typesPieOptions = useMemo(
    () => ({
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false, external: externalPieTooltip },
      },
      layout: { padding: CHART_SAFE_PAD },
      elements: { arc: { borderWidth: 0 } },
      animation: { duration: 450, easing: 'easeOutQuart' },
      maintainAspectRatio: false,
      responsive: true,
    }),
    []
  );

  // Hover da legenda destaca a fatia no gráfico
  const handleTypesLegendHover = (index: number | null) => {
    const chart = typesChartRef.current as any;
    if (!chart) return;

    if (index === null) {
      chart.setActiveElements([]);
      chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
      chart.update();
      return;
    }

    const meta = chart.getDatasetMeta(0);
    const el = meta?.data?.[index];
    const pos = el ? { x: el.x, y: el.y } : { x: (chart as any).chartArea?.left ?? 0, y: (chart as any).chartArea?.top ?? 0 };

    chart.setActiveElements([{ datasetIndex: 0, index }]);
    chart.tooltip?.setActiveElements([{ datasetIndex: 0, index }], pos);
    chart.update();
  };

  useEffect(() => {
    // Hook já carrega os dados automaticamente
  }, []);

  /* ===================== LAYOUT ===================== */
  const CARD_COMMON =
    'bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6 overflow-hidden flex flex-col h-[420px] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1';

  // Donut (referência de tamanho)
  const CHART_BOX_DONUT =
    'relative w-[170px] sm:w-[190px] lg:w-[180px] xl:w-[200px] 2xl:w-[220px] aspect-square overflow-visible';
  const LEGEND_COL_DONUT = 'shrink-0 w-[140px] sm:w-[150px] lg:w-[150px] xl:w-[170px]';
  const SET_GAP_DONUT = 'gap-4 xl:gap-6';

  // Pizza com mesmo diâmetro do donut
  const CHART_BOX_PIE =
    'relative w-[170px] sm:w-[190px] lg:w-[180px] xl:w-[200px] 2xl:w-[220px] aspect-square overflow-visible';
  const LEGEND_COL = 'shrink-0 w-[150px] sm:w-[160px] lg:w-[160px] xl:w-[180px]';
  const SET_GAP = 'gap-6';

  return (
    <div className="w-full max-w-none mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="text-center mb-20">
        <div className="inline-block">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Dados Estatísticos
            </h2>
          </div>
        </div>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Visualize dados importantes sobre nossos 
          <span className="text-indigo-600 font-semibold"> documentos institucionais</span>
        </p>
        
      </div>

      {/* === GRID: 3 CARDS LADO A LADO — Setores no MEIO === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* 1) Donut */}
        <div className={CARD_COMMON}>
          <h4 className="text-base font-bold text-gray-900 text-center mb-2">Status dos documentos</h4>

          <div className="flex-1 w-full grid place-items-center">
            <div className={`w-fit ${SET_GAP_DONUT} mx-auto flex items-center justify-center`}>
              {/* Círculo */}
              <div className={CHART_BOX_DONUT} role="img" aria-label="Status dos documentos">
                <Doughnut data={statusPieData} options={statusPieOptions} />
                {/* Centro do donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  {statusHover === null ? (
                    <>
                      <span className="font-extrabold text-gray-900" style={{ fontSize: 'clamp(20px, 2.8vw, 30px)' }}>
                        {statusTotal}
                      </span>
                      <span className="text-[9px] md:text-[10px] leading-3 text-gray-500 whitespace-nowrap">
                        documentos no total
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-extrabold text-gray-900" style={{ fontSize: 'clamp(19px, 2.5vw, 26px)' }}>
                        {statusValues[statusHover]}
                      </span>
                      <span className="text-[10px] md:text-xs text-gray-600">
                        {statusLabels[statusHover]}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Legenda */}
              <ul className={`${LEGEND_COL_DONUT} self-center flex flex-col gap-2`}>
                {statusLabels.map((label, i) => {
                  const color = statusColors[i];
                  return (
                    <li key={label} className="flex items-center gap-2 px-2 py-1 text-left cursor-default">
                      <span
                        className="shrink-0 w-4 h-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      />
                      <span className="text-sm text-gray-800 truncate">{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* 2) Setores */}
        <div className={CARD_COMMON}>
          <h4 className="text-base font-bold text-gray-900 text-center mb-2">
            Setores com documentos ativos
          </h4>

          <div className="flex-1 w-full flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-2 text-center">
              <Building2 className="w-6 h-6 text-blue-600" aria-hidden />
              <span className="text-3xl font-extrabold text-blue-600 leading-none">
                {activeSectors}
              </span>
            </div>

            <div className="w-full max-w-[360px]" role="img" aria-label="Top 10 setores com mais documentos">
              <div className="h-[140px]">
                <Bar data={sectorsBarData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  layout: { 
                    padding: { top: 8, right: 8, bottom: 8, left: 8 } 
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1,
                      cornerRadius: 8,
                      displayColors: false,
                      padding: 12,
                      callbacks: {
                        title: (context) => topSectors[context[0].dataIndex]?.label || `Setor ${context[0].dataIndex + 1}`,
                        label: (context) => `${context.parsed.y} documentos`
                      }
                    }
                  },
                  interaction: { 
                    mode: 'nearest', 
                    intersect: true 
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        display: false
                      },
                      grid: {
                        display: false
                      }
                    },
                    x: {
                      ticks: {
                        display: false
                      },
                      grid: {
                        display: false
                      }
                    }
                  },
                  animation: {
                    duration: 450,
                    easing: 'easeOutQuart'
                  }
                }} />
              </div>
            </div>

            <div className="text-center text-slate-600 text-sm">
              Top 10 setores
            </div>
          </div>
        </div>

        {/* 3) Pizza — CONJUNTO (círculo + legenda) CENTRALIZADO */}
        <div className={CARD_COMMON}>
          <h4 className="text-base font-bold text-gray-900 text-center mb-2">Tipo de documento</h4>

          <div className="flex-1 w-full grid place-items-center">
            <div className={`w-fit ${SET_GAP} mx-auto flex items-center justify-center`}>
              {/* Círculo */}
              <div className={CHART_BOX_PIE} role="img" aria-label="Tipo de documento">
                <Pie ref={typesChartRef} data={typesPieData} options={typesPieOptions as any} />
              </div>

              {/* Legenda */}
              <ul className={`${LEGEND_COL} self-center flex flex-col gap-2`}>
                {typesAgg.map((t, i) => (
                  <li 
                    key={t.key} 
                    className="flex items-center gap-2 px-2 py-1 text-left cursor-default"
                    title={`${t.key}: ${t.displayName}`}
                    onMouseEnter={() => handleTypesLegendHover(i)}
                    onMouseLeave={() => handleTypesLegendHover(null)}
                    aria-label={t.displayName}
                  >
                    <span
                      className="shrink-0 w-4 h-4 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: t.color }}
                      aria-hidden
                    />
                    <span className="text-sm text-gray-800 truncate">{t.key}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* === /GRID === */}
    </div>
  );
};

export default ChartsSection;


