import React, { useState } from 'react';
import { Instrument, TableTab } from '../types/market';
import { Star, ArrowUpDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface MarketsTableProps {
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
  onRefreshPrices: () => void;
  isUpdating?: boolean;
}

export const MarketsTable: React.FC<MarketsTableProps> = ({
  instruments,
  onSelectInstrument,
  watchlist,
  onToggleWatchlist,
  onRefreshPrices,
  isUpdating = false,
}) => {
  const [activeTab, setActiveTab] = useState<TableTab>('overview');
  const [sortField, setSortField] = useState<string>('volume');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const tabs: { id: TableTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Performance' },
    { id: 'technical', label: 'Technical' },
    { id: 'valuation', label: 'Valuation' },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Sort instruments
  const sortedInstruments = [...instruments].sort((a, b) => {
    let aVal: any = a.changePercent;
    let bVal: any = b.changePercent;

    if (sortField === 'ticker') {
      aVal = a.ticker;
      bVal = b.ticker;
    } else if (sortField === 'lastPrice') {
      aVal = a.lastPrice;
      bVal = b.lastPrice;
    } else if (sortField === 'changePercent') {
      aVal = a.changePercent;
      bVal = b.changePercent;
    } else if (sortField === 'changeValue') {
      aVal = a.changeValue;
      bVal = b.changeValue;
    } else if (sortField === 'high') {
      aVal = a.high;
      bVal = b.high;
    } else if (sortField === 'low') {
      aVal = a.low;
      bVal = b.low;
    } else if (sortField === 'rsi') {
      aVal = a.rsi || 50;
      bVal = b.rsi || 50;
    }

    if (typeof aVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Strong Buy':
        return (
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#089981]/15 text-[#089981] whitespace-nowrap">
            Strong Buy
          </span>
        );
      case 'Buy':
        return (
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#089981]/15 text-[#089981] whitespace-nowrap">
            Buy
          </span>
        );
      case 'Neutral':
        return (
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-[#787B86] whitespace-nowrap">
            Neutral
          </span>
        );
      case 'Sell':
        return (
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#F23645]/15 text-[#F23645] whitespace-nowrap">
            Sell
          </span>
        );
      case 'Strong Sell':
        return (
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#F23645]/20 text-[#F23645] whitespace-nowrap">
            Strong Sell
          </span>
        );
      default:
        return null;
    }
  };

  // Sparkline path generator
  const renderTrendSvg = (instrument: Instrument) => {
    const isBull = instrument.changePercent >= 0;
    // Generate curved or stepped path
    const points = instrument.sparkline;
    if (!points || points.length < 2) {
      return isBull ? (
        <svg className="w-20 h-6 mx-auto text-[#089981]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 80 25">
          <path d="M2 20 Q 20 22, 35 14 T 60 8 T 78 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg className="w-20 h-6 mx-auto text-[#F23645]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 80 25">
          <path d="M2 6 Q 20 8, 40 16 T 60 14 T 78 20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;
    const padding = 2;

    const coords = points.map((p, i) => {
      const x = padding + (i / (points.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((p - min) / range) * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const d = `M ${coords.join(' L ')}`;

    return (
      <svg
        className={`w-20 h-6 mx-auto ${isBull ? 'text-[#089981]' : 'text-[#F23645]'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 80 25"
      >
        <path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <section className="space-y-4 pt-4" data-purpose="watchlist-table-container">
      {/* Table Filter Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0E3EB] pb-3">
        <div>
          <h2 className="text-xl font-bold text-[#131722] flex items-center gap-2">
            Most Active &amp; Trending
            <button
              onClick={onRefreshPrices}
              aria-label="Refresh quotes"
              title="Refresh live prices"
              className="p-1 rounded-md text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin text-[#2962FF]' : ''}`} />
            </button>
          </h2>
          <p className="text-xs text-[#787B86] mt-0.5">Top traded instruments across primary asset classes today</p>
        </div>

        {/* View switcher tabs */}
        <div className="flex items-center gap-1 bg-[#F0F3FA] p-1 rounded-lg self-start sm:self-auto text-xs font-medium">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white font-semibold text-[#131722] shadow-2xs'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Table Container */}
      <div className="overflow-x-auto border border-[#E0E3EB] rounded-xl bg-white shadow-2xs">
        <table className="w-full text-left text-sm whitespace-nowrap" id="markets-table">
          <thead className="bg-[#F0F3FA]/60 text-xs font-semibold text-[#787B86] uppercase tracking-wider border-b border-[#E0E3EB]">
            <tr>
              <th className="py-3 px-4 w-8 text-center" scope="col">
                <span className="sr-only">Watchlist</span>
              </th>
              <th
                onClick={() => handleSort('ticker')}
                className="py-3 px-4 cursor-pointer hover:text-[#131722] transition-colors select-none"
                scope="col"
              >
                <div className="flex items-center gap-1">
                  <span>Ticker / Name</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('lastPrice')}
                className="py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Last Price</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>

              {/* Dynamic Headers based on active tab */}
              {activeTab === 'overview' && (
                <>
                  <th
                    onClick={() => handleSort('changePercent')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
                    scope="col"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Change %</span>
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('changeValue')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
                    scope="col"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Change Value</span>
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('high')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
                    scope="col"
                  >
                    <span>High</span>
                  </th>
                  <th
                    onClick={() => handleSort('low')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
                    scope="col"
                  >
                    <span>Low</span>
                  </th>
                  <th className="py-3 px-4 text-center" scope="col">
                    Technical Rating
                  </th>
                  <th className="py-3 px-4 text-right" scope="col">
                    Volume
                  </th>
                  <th className="py-3 px-4 text-center" scope="col">
                    Trend (1D)
                  </th>
                </>
              )}

              {activeTab === 'performance' && (
                <>
                  <th className="py-3 px-4 text-right" scope="col">1W</th>
                  <th className="py-3 px-4 text-right" scope="col">1M</th>
                  <th className="py-3 px-4 text-right" scope="col">3M</th>
                  <th className="py-3 px-4 text-right" scope="col">6M</th>
                  <th className="py-3 px-4 text-right" scope="col">YTD</th>
                  <th className="py-3 px-4 text-right" scope="col">1Y</th>
                  <th className="py-3 px-4 text-right" scope="col">Volatility</th>
                </>
              )}

              {activeTab === 'technical' && (
                <>
                  <th className="py-3 px-4 text-right" scope="col">RSI (14)</th>
                  <th className="py-3 px-4 text-left" scope="col">MACD</th>
                  <th className="py-3 px-4 text-right" scope="col">MA 50</th>
                  <th className="py-3 px-4 text-right" scope="col">MA 200</th>
                  <th className="py-3 px-4 text-center" scope="col">Technical Rating</th>
                  <th className="py-3 px-4 text-right" scope="col">Oscillators</th>
                </>
              )}

              {activeTab === 'valuation' && (
                <>
                  <th className="py-3 px-4 text-right" scope="col">Market Cap</th>
                  <th className="py-3 px-4 text-right" scope="col">P/E Ratio</th>
                  <th className="py-3 px-4 text-right" scope="col">Forward P/E</th>
                  <th className="py-3 px-4 text-right" scope="col">EPS (TTM)</th>
                  <th className="py-3 px-4 text-right" scope="col">Div Yield</th>
                  <th className="py-3 px-4 text-right" scope="col">Beta</th>
                </>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E0E3EB]">
            {sortedInstruments.map((instrument) => {
              const isBull = instrument.changePercent >= 0;
              const isSaved = watchlist.includes(instrument.ticker);

              return (
                <tr
                  key={instrument.id}
                  onClick={() => onSelectInstrument(instrument)}
                  className="hover:bg-[#F8F9FD] transition-colors cursor-pointer group"
                >
                  {/* Star Watchlist Column */}
                  <td
                    className="py-3.5 px-3 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(instrument.ticker);
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Toggle watchlist for ${instrument.ticker}`}
                      className="p-1 rounded text-[#787B86] hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isSaved ? 'text-amber-500 fill-amber-500' : 'text-[#787B86]/40 hover:text-amber-500'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Ticker / Name */}
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div
                      style={{ backgroundColor: instrument.badgeBgColor }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[11px] shadow-2xs shrink-0"
                    >
                      {instrument.badgeText}
                    </div>
                    <div>
                      <div className="font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors flex items-center gap-1.5">
                        <span>{instrument.ticker}</span>
                        {isBull ? (
                          <TrendingUp className="w-3 h-3 text-[#089981] opacity-0 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-[#F23645] opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <div className="text-xs text-[#787B86] truncate max-w-[180px] sm:max-w-none">
                        {instrument.name}
                      </div>
                    </div>
                  </td>

                  {/* Last Price */}
                  <td className="py-3.5 px-4 text-right font-semibold tabular-nums text-[#131722]">
                    ${instrument.lastPrice > 100
                      ? instrument.lastPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : instrument.lastPrice.toFixed(instrument.lastPrice < 10 ? 4 : 2)}
                  </td>

                  {/* Dynamic Columns */}
                  {activeTab === 'overview' && (
                    <>
                      <td
                        className={`py-3.5 px-4 text-right font-semibold tabular-nums ${
                          isBull ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isBull ? `+${instrument.changePercent.toFixed(2)}%` : `${instrument.changePercent.toFixed(2)}%`}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-medium tabular-nums ${
                          isBull ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isBull ? `+${instrument.changeValue.toFixed(2)}` : instrument.changeValue.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        ${instrument.high.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        ${instrument.low.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {getRatingBadge(instrument.technicalRating)}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        {instrument.volume}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {renderTrendSvg(instrument)}
                      </td>
                    </>
                  )}

                  {activeTab === 'performance' && (
                    <>
                      <td className={`py-3.5 px-4 text-right font-semibold tabular-nums ${Number(instrument.perf1W || 0) >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                        {Number(instrument.perf1W || 0) >= 0 ? `+${instrument.perf1W}%` : `${instrument.perf1W}%`}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-semibold tabular-nums ${Number(instrument.perf1M || 0) >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                        {Number(instrument.perf1M || 0) >= 0 ? `+${instrument.perf1M}%` : `${instrument.perf1M}%`}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-semibold tabular-nums ${Number(instrument.perf3M || 0) >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                        {Number(instrument.perf3M || 0) >= 0 ? `+${instrument.perf3M}%` : `${instrument.perf3M}%`}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-semibold tabular-nums ${Number(instrument.perf6M || 0) >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                        {Number(instrument.perf6M || 0) >= 0 ? `+${instrument.perf6M}%` : `${instrument.perf6M}%`}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-semibold tabular-nums ${Number(instrument.perfYTD || 0) >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                        {Number(instrument.perfYTD || 0) >= 0 ? `+${instrument.perfYTD}%` : `${instrument.perfYTD}%`}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-semibold tabular-nums ${Number(instrument.perf1Y || 0) >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                        {Number(instrument.perf1Y || 0) >= 0 ? `+${instrument.perf1Y}%` : `${instrument.perf1Y}%`}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        {instrument.volatility || '1.85%'}
                      </td>
                    </>
                  )}

                  {activeTab === 'technical' && (
                    <>
                      <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-[#131722]">
                        {instrument.rsi || 55.4}
                      </td>
                      <td className="py-3.5 px-4 text-left font-medium text-xs text-[#787B86]">
                        {instrument.macd || 'Bullish'}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        ${instrument.ma50?.toLocaleString() || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        ${instrument.ma200?.toLocaleString() || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {getRatingBadge(instrument.technicalRating)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-[#787B86]">
                        {instrument.oscillators || 'Buy (8/11)'}
                      </td>
                    </>
                  )}

                  {activeTab === 'valuation' && (
                    <>
                      <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-[#131722]">
                        {instrument.marketCap || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        {instrument.peRatio || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        {instrument.forwardPe || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        {instrument.eps || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        {instrument.divYield || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787B86]">
                        {instrument.beta || '—'}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
