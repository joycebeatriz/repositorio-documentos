import 'chart.js';

declare module 'chart.js' {
  // Permite opções por-plugin no options.plugins
  interface PluginOptionsByType<TType extends ChartType> {
    donutTrack?: { color?: string };
    arcLabels?: boolean;
  }
}