import React from 'react';
import { IndexSummaryCard, MarketCategory } from '../types/market';
import { ChevronRight } from 'lucide-react';

interface IndicesCardsProps {
  cards: IndexSummaryCard[];
  category: MarketCategory;
  onSelectInstrument: (ticker: string) => void;
  marketStatusText?: string;
  isLiveUpdating?: boolean;
}

export const IndicesCards: React.FC<IndicesCardsProps> = ({
  cards,
  category,
  onSelectInstrument,
  marketStatusText = 'US Markets Open',
  isLiveUpdating = true,
}) => {
  const getCategoryTitle = () => {
    switch (category) {
      case 'indices':
        return 'Indices';
      case 'stocks':
        return 'Major Stocks';
      case 'crypto':
        return 'Top Crypto';
      case 'forex':
        return 'Major Currencies';
      case 'futures':
        return 'Active Futures';
      case 'bonds':
        return 'Sovereign Bonds';
      default:
        return 'Markets';
    }
  };

  return (
    <section className="space-y-4" data-purpose="major-indices">
      {/* Section Link Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSelectInstrument(cards[0]?.ticker || 'SPX')}
          className="inline-flex items-center gap-1.5 text-2xl font-bold text-[#131722] hover:text-[#2962FF] transition-colors group cursor-pointer"
        >
          <span>{getCategoryTitle()}</span>
          <ChevronRight className="w-5 h-5 text-[#787B86] group-hover:text-[#2962FF] group-hover:translate-x-1 transition-all" />
        </button>

        <div className="flex items-center gap-3 text-xs font-semibold text-[#787B86]">
          {isLiveUpdating && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#787B86]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
              Real-time ticks
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
            <span>{marketStatusText}</span>
          </div>
        </div>
      </div>

      {/* Quick Index Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isBull = card.changePercent >= 0;
          return (
            <article
              key={card.id}
              onClick={() => onSelectInstrument(card.ticker)}
              className="p-4 bg-[#F0F3FA]/70 hover:bg-[#F8F9FD] hover:shadow-xs border border-transparent hover:border-[#E0E3EB] rounded-2xl transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: card.badgeBgColor }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs shadow-inner shrink-0"
                  >
                    {card.badgeText}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF] transition-colors truncate">
                      {card.name}
                    </h3>
                    <span className="text-xs text-[#787B86] font-medium">{card.ticker}</span>
                  </div>
                </div>

                {/* Mini Sparkline */}
                <svg
                  className={`w-16 h-8 ${isBull ? 'text-[#089981]' : 'text-[#F23645]'}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 100 40"
                >
                  <path d={card.sparklinePoints} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xl font-bold tabular-nums text-[#131722]">
                  {card.lastPrice > 100
                    ? card.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : card.lastPrice.toFixed(card.lastPrice < 10 ? 4 : 2)}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded tabular-nums ${
                    isBull
                      ? 'text-[#089981] bg-[#089981]/10'
                      : 'text-[#F23645] bg-[#F23645]/10'
                  }`}
                >
                  {isBull ? `+${card.changePercent.toFixed(2)}%` : `${card.changePercent.toFixed(2)}%`}
                  {' '}
                  ({isBull ? `+${card.changeValue.toFixed(2)}` : card.changeValue.toFixed(2)})
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
