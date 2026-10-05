import React, { useState, useEffect, useRef } from 'react';
import { Instrument } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  instruments,
  onSelectInstrument,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = instruments.filter((inst) => {
    const matchesCategory = selectedCategory === 'all' || inst.category === selectedCategory;
    const matchesQuery =
      inst.ticker.toLowerCase().includes(query.toLowerCase()) ||
      inst.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categories = [
    { id: 'all', label: 'All Assets' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'indices', label: 'Indices' },
    { id: 'forex', label: 'Forex' },
    { id: 'futures', label: 'Futures' },
  ];

  const popularSymbols = ['NVDA', 'BTCUSD', 'AAPL', 'TSLA', 'SPX', 'ETHUSD'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] w-full max-w-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E0E3EB] gap-3">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickers, companies, indices, crypto..."
            className="w-full bg-transparent border-none outline-none text-base text-[#131722] placeholder:text-[#787B86] focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-[#F0F3FA] text-[#787B86]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] bg-[#F0F3FA] border border-[#E0E3EB] rounded px-2 py-0.5 text-[#787B86] font-mono">
            ESC
          </kbd>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#E0E3EB] bg-[#F8F9FD] overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-[#131722] text-white font-semibold'
                  : 'text-[#787B86] hover:bg-[#E0E3EB]/60 hover:text-[#131722]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[#E0E3EB]/50">
          {filtered.length > 0 ? (
            filtered.map((inst) => {
              const isBull = inst.changePercent >= 0;
              return (
                <div
                  key={inst.id}
                  onClick={() => {
                    onSelectInstrument(inst);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F0F3FA] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: inst.badgeBgColor }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs"
                    >
                      {inst.badgeText}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF] transition-colors flex items-center gap-1.5">
                        <span>{inst.ticker}</span>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-gray-100 text-[#787B86]">
                          {inst.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86] truncate max-w-[200px] sm:max-w-xs">
                        {inst.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-sm tabular-nums text-[#131722]">
                      ${inst.lastPrice > 100 ? inst.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : inst.lastPrice.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs font-medium tabular-nums flex items-center justify-end gap-1 ${
                        isBull ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isBull ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isBull ? `+${inst.changePercent.toFixed(2)}%` : `${inst.changePercent.toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-[#787B86]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium text-[#131722]">No instruments found</p>
              <p className="text-xs mt-1">Try searching for a different symbol or ticker.</p>
            </div>
          )}
        </div>

        {/* Quick Suggestions Footer */}
        <div className="px-4 py-3 bg-[#F8F9FD] border-t border-[#E0E3EB] flex items-center justify-between text-xs text-[#787B86]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="font-medium text-[#131722] shrink-0">Popular:</span>
            {popularSymbols.map((sym) => (
              <button
                key={sym}
                onClick={() => setQuery(sym)}
                className="px-2 py-0.5 rounded bg-white border border-[#E0E3EB] hover:border-[#2962FF] hover:text-[#2962FF] transition-colors cursor-pointer font-mono"
              >
                {sym}
              </button>
            ))}
          </div>
          <span className="hidden sm:inline-block text-[11px]">Press ↵ to view</span>
        </div>
      </div>
    </div>
  );
};
