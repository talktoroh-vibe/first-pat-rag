import React, { useState } from 'react';
import { Instrument } from '../types/market';
import { X, Star, Bell, TrendingUp, TrendingDown, ArrowUpRight, DollarSign } from 'lucide-react';

interface ChartModalProps {
  instrument: Instrument | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (ticker: string) => void;
  onOpenTrade: (instrument: Instrument) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '1Y' | 'ALL';

export const ChartModal: React.FC<ChartModalProps> = ({
  instrument,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onOpenTrade,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!instrument) return null;

  const isBull = instrument.changePercent >= 0;
  const timeframes: Timeframe[] = ['1D', '5D', '1M', '1Y', 'ALL'];

  // Retrieve chart points
  const rawChartPoints = instrument.chartData?.[timeframe] || instrument.chartData?.['1D'] || [];
  const points = rawChartPoints.length > 0 ? rawChartPoints : [
    { time: '09:30', price: instrument.low, volume: 100000 },
    { time: '12:00', price: instrument.lastPrice, volume: 250000 },
    { time: '16:00', price: instrument.high, volume: 180000 },
  ];

  const minPrice = Math.min(...points.map((p) => p.price));
  const maxPrice = Math.max(...points.map((p) => p.price));
  const priceRange = maxPrice - minPrice || 1;

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const padX = 20;
  const padY = 25;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * (svgWidth - 2 * padX);
    const y = svgHeight - padY - ((p.price - minPrice) / priceRange) * (svgHeight - 2 * padY);
    return { x, y, ...p };
  });

  const lineD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${lineD} L ${coords[coords.length - 1].x} ${svgHeight - padY} L ${coords[0].x} ${svgHeight - padY} Z`;

  const activePoint = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : coords[coords.length - 1];

  // Day range slider calculation
  const dayRangeSpread = instrument.high - instrument.low || 1;
  const currentDayPos = Math.max(0, Math.min(100, ((instrument.lastPrice - instrument.low) / dayRangeSpread) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-[#E0E3EB] flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: instrument.badgeBgColor }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-inner shrink-0"
            >
              {instrument.badgeText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#131722]">{instrument.ticker}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0F3FA] text-[#787B86] uppercase">
                  {instrument.category}
                </span>
              </div>
              <p className="text-xs text-[#787B86] font-medium">{instrument.name}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(instrument.ticker)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isWatchlisted
                  ? 'border-amber-400 bg-amber-50 text-amber-600'
                  : 'border-[#E0E3EB] hover:bg-[#F0F3FA] text-[#787B86]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={() => onOpenTrade(instrument)}
              className="bg-[#2962FF] hover:bg-[#1E4BD8] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Simulate Order</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Price Overview Banner */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl font-extrabold tabular-nums text-[#131722]">
                ${activePoint?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-sm font-semibold flex items-center gap-1 tabular-nums ${
                    isBull ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isBull ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {isBull ? `+${instrument.changePercent.toFixed(2)}%` : `${instrument.changePercent.toFixed(2)}%`}
                  {' '}(${instrument.changeValue > 0 ? `+${instrument.changeValue}` : instrument.changeValue})
                </span>
                <span className="text-xs text-[#787B86]">Today</span>
                {hoverIndex !== null && (
                  <span className="text-xs text-[#2962FF] font-medium ml-2">
                    Hover: {activePoint.time}
                  </span>
                )}
              </div>
            </div>

            {/* Timeframe Pill Selectors */}
            <div className="flex items-center gap-1 bg-[#F0F3FA] p-1 rounded-lg text-xs font-medium">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white font-bold text-[#131722] shadow-2xs'
                      : 'text-[#787B86] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Chart Container */}
          <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-xl p-3 relative overflow-hidden">
            <div className="absolute top-3 left-4 text-[11px] font-mono text-[#787B86]">
              High: ${maxPrice.toFixed(2)} · Low: ${minPrice.toFixed(2)}
            </div>

            <div
              className="w-full relative cursor-crosshair"
              onMouseLeave={() => setHoverIndex(null)}
            >
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-56 sm:h-64"
                preserveAspectRatio="none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const relX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, (relX - padX) / (svgWidth - 2 * padX)));
                  const idx = Math.round(ratio * (coords.length - 1));
                  setHoverIndex(idx);
                }}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isBull ? '#089981' : '#F23645'}
                      stopOpacity="0.25"
                    />
                    <stop
                      offset="100%"
                      stopColor={isBull ? '#089981' : '#F23645'}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line
                  x1={padX}
                  y1={padY}
                  x2={svgWidth - padX}
                  y2={padY}
                  stroke="#E0E3EB"
                  strokeDasharray="4 4"
                />
                <line
                  x1={padX}
                  y1={svgHeight / 2}
                  x2={svgWidth - padX}
                  y2={svgHeight / 2}
                  stroke="#E0E3EB"
                  strokeDasharray="4 4"
                />
                <line
                  x1={padX}
                  y1={svgHeight - padY}
                  x2={svgWidth - padX}
                  y2={svgHeight - padY}
                  stroke="#E0E3EB"
                  strokeDasharray="4 4"
                />

                {/* Shaded Area */}
                <path d={areaD} fill="url(#chartGradient)" />

                {/* Price Stroke Line */}
                <path
                  d={lineD}
                  fill="none"
                  stroke={isBull ? '#089981' : '#F23645'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Crosshair indicator */}
                {hoverIndex !== null && coords[hoverIndex] && (
                  <g>
                    <line
                      x1={coords[hoverIndex].x}
                      y1={padY}
                      x2={coords[hoverIndex].x}
                      y2={svgHeight - padY}
                      stroke="#2962FF"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={coords[hoverIndex].x}
                      cy={coords[hoverIndex].y}
                      r="5"
                      fill="#2962FF"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Day & 52-Week Range Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Day's Range */}
            <div className="bg-[#F0F3FA]/70 border border-[#E0E3EB] rounded-xl p-4">
              <div className="flex justify-between items-center text-xs font-semibold text-[#131722] mb-2">
                <span>Day's Range</span>
                <span className="font-mono text-[#787B86] tabular-nums">
                  ${instrument.low.toFixed(2)} - ${instrument.high.toFixed(2)}
                </span>
              </div>
              <div className="relative w-full h-2 bg-[#E0E3EB] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 bg-[#2962FF] rounded-full"
                  style={{ width: `${currentDayPos}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#787B86] mt-1 tabular-nums">
                <span>Low: ${instrument.low.toFixed(2)}</span>
                <span className="text-[#2962FF] font-semibold">Current: ${instrument.lastPrice.toFixed(2)}</span>
                <span>High: ${instrument.high.toFixed(2)}</span>
              </div>
            </div>

            {/* Technical Consensus Meter */}
            <div className="bg-[#F0F3FA]/70 border border-[#E0E3EB] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-semibold text-[#131722]">
                <span>Technical Sentiment</span>
                <span className="font-bold text-[#089981]">{instrument.technicalRating}</span>
              </div>
              <div className="grid grid-cols-5 gap-1 my-2">
                {['Strong Sell', 'Sell', 'Neutral', 'Buy', 'Strong Buy'].map((tier, idx) => {
                  const isActive = instrument.technicalRating === tier;
                  const bgColors = ['bg-red-500', 'bg-red-400', 'bg-gray-300', 'bg-emerald-400', 'bg-emerald-600'];
                  return (
                    <div
                      key={tier}
                      className={`h-2 rounded-full transition-all ${
                        isActive ? `${bgColors[idx]} ring-2 ring-black` : 'bg-gray-200 opacity-60'
                      }`}
                      title={tier}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-[#787B86] font-medium">
                <span>Strong Sell</span>
                <span>Neutral</span>
                <span>Strong Buy</span>
              </div>
            </div>
          </div>

          {/* Key Fundamentals & Statistics Grid */}
          <div>
            <h3 className="text-sm font-bold text-[#131722] mb-3">Key Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-lg p-3">
                <div className="text-[11px] text-[#787B86]">Open</div>
                <div className="text-sm font-bold tabular-nums text-[#131722] mt-0.5">
                  ${instrument.open ? instrument.open.toFixed(2) : instrument.low.toFixed(2)}
                </div>
              </div>
              <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-lg p-3">
                <div className="text-[11px] text-[#787B86]">Prev Close</div>
                <div className="text-sm font-bold tabular-nums text-[#131722] mt-0.5">
                  ${instrument.prevClose ? instrument.prevClose.toFixed(2) : instrument.lastPrice.toFixed(2)}
                </div>
              </div>
              <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-lg p-3">
                <div className="text-[11px] text-[#787B86]">Volume</div>
                <div className="text-sm font-bold tabular-nums text-[#131722] mt-0.5">
                  {instrument.volume}
                </div>
              </div>
              <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-lg p-3">
                <div className="text-[11px] text-[#787B86]">Market Cap</div>
                <div className="text-sm font-bold tabular-nums text-[#131722] mt-0.5">
                  {instrument.marketCap || '—'}
                </div>
              </div>
              <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-lg p-3">
                <div className="text-[11px] text-[#787B86]">P/E Ratio</div>
                <div className="text-sm font-bold tabular-nums text-[#131722] mt-0.5">
                  {instrument.peRatio || '—'}
                </div>
              </div>
              <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-lg p-3">
                <div className="text-[11px] text-[#787B86]">52W Range</div>
                <div className="text-sm font-bold tabular-nums text-[#131722] mt-0.5">
                  ${instrument.week52Low || (instrument.low * 0.7).toFixed(0)} - ${instrument.week52High || (instrument.high * 1.2).toFixed(0)}
                </div>
              </div>
              <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-lg p-3">
                <div className="text-[11px] text-[#787B86]">Beta</div>
                <div className="text-sm font-bold tabular-nums text-[#131722] mt-0.5">
                  {instrument.beta || '1.00'}
                </div>
              </div>
              <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-lg p-3">
                <div className="text-[11px] text-[#787B86]">RSI (14)</div>
                <div className="text-sm font-bold tabular-nums text-[#131722] mt-0.5">
                  {instrument.rsi || 58.4}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {instrument.description && (
            <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-xl p-4 text-xs text-[#787B86] leading-relaxed">
              <span className="font-semibold text-[#131722] block mb-1">About {instrument.name}</span>
              {instrument.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
