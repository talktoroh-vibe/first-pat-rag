export type MarketCategory = 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';

export type TableTab = 'overview' | 'performance' | 'technical' | 'valuation';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface SparklinePoint {
  x: number;
  y: number;
}

export interface Instrument {
  id: string;
  ticker: string;
  name: string;
  category: MarketCategory;
  lastPrice: number;
  changePercent: number;
  changeValue: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  volume: string;
  technicalRating: TechnicalRating;
  badgeText: string;
  badgeBgColor: string;
  trend: 'bull' | 'bear';
  sparkline: number[];
  
  // Performance tab data
  perf1W?: number;
  perf1M?: number;
  perf3M?: number;
  perf6M?: number;
  perfYTD?: number;
  perf1Y?: number;
  volatility?: string;

  // Technical tab data
  rsi?: number;
  macd?: string;
  ma50?: number;
  ma200?: number;
  oscillators?: string;

  // Valuation tab data
  marketCap?: string;
  peRatio?: number | string;
  forwardPe?: number | string;
  eps?: number | string;
  divYield?: string;
  beta?: number | string;

  // Chart data
  chartData?: {
    '1D': { time: string; price: number; volume: number }[];
    '5D': { time: string; price: number; volume: number }[];
    '1M': { time: string; price: number; volume: number }[];
    '1Y': { time: string; price: number; volume: number }[];
    'ALL': { time: string; price: number; volume: number }[];
  };
  
  week52High?: number;
  week52Low?: number;
  description?: string;
}

export interface IndexSummaryCard {
  id: string;
  ticker: string;
  name: string;
  badgeText: string;
  badgeBgColor: string;
  lastPrice: number;
  changePercent: number;
  changeValue: number;
  trend: 'bull' | 'bear';
  sparklinePoints: string;
}
