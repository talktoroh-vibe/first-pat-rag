import React, { useState } from 'react';
import { MarketCategory } from '../types/market';
import { marketRegions } from '../data/marketsData';
import { ChevronDown, Check, Clock } from 'lucide-react';

interface HeroSectionProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  selectedRegion: string;
  onSelectRegion: (regId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
}) => {
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);

  const categories: { id: MarketCategory; label: string }[] = [
    { id: 'indices', label: 'Indices' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'futures', label: 'Futures' },
    { id: 'bonds', label: 'Bonds' },
  ];

  const currentRegion = marketRegions.find((r) => r.id === selectedRegion) || marketRegions[0];

  return (
    <div className="space-y-6">
      {/* Hero Title Section */}
      <section className="text-center pt-4 pb-2 relative" data-purpose="hero-title">
        <div className="relative inline-block">
          <button
            onClick={() => setRegionMenuOpen(!regionMenuOpen)}
            type="button"
            className="inline-flex items-center justify-center gap-3 cursor-pointer group focus:outline-none"
            aria-expanded={regionMenuOpen}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#131722] hover:text-[#2962FF] transition-colors">
              Markets, everywhere
            </h1>
            <ChevronDown className="w-7 h-7 md:w-9 md:h-9 text-[#131722] transform group-hover:translate-y-1 transition-transform" />
          </button>

          {/* Region Switcher Popover */}
          {regionMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-white border border-[#E0E3EB] rounded-2xl shadow-xl py-2 z-50 text-left">
              <div className="px-4 py-2 border-b border-[#E0E3EB]">
                <span className="text-[11px] font-bold text-[#787B86] uppercase tracking-wider">
                  Select Financial Market Region
                </span>
              </div>
              <div className="py-1">
                {marketRegions.map((region) => {
                  const isSelected = region.id === selectedRegion;
                  return (
                    <button
                      key={region.id}
                      onClick={() => {
                        onSelectRegion(region.id);
                        setRegionMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#F0F3FA] text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{region.flag}</span>
                        <div>
                          <div className="font-semibold text-xs text-[#131722]">{region.name}</div>
                          <div className="text-[10px] text-[#787B86] flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {region.hours}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            region.status.includes('Open') || region.status.includes('Active')
                              ? 'bg-[#089981]/15 text-[#089981]'
                              : 'bg-gray-100 text-[#787B86]'
                          }`}
                        >
                          {region.status}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <p className="text-[#787B86] mt-2 text-sm sm:text-base font-normal max-w-2xl mx-auto">
          Real-time quotes, technical insights, and community analytics for global finance
        </p>

        {/* Selected Region Status Indicator */}
        <div className="mt-2.5 inline-flex items-center gap-2 text-xs text-[#787B86] bg-[#F0F3FA] px-3 py-1 rounded-full">
          <span>{currentRegion.flag} {currentRegion.name}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5 font-medium text-[#131722]">
            <span
              className={`w-2 h-2 rounded-full ${
                currentRegion.status.includes('Open') || currentRegion.status.includes('Active')
                  ? 'bg-[#089981] animate-pulse'
                  : 'bg-amber-500'
              }`}
            />
            {currentRegion.status} ({currentRegion.hours})
          </span>
        </div>
      </section>

      {/* Markets Category Pill Navigation */}
      <section
        className="flex items-center justify-center border-b border-[#E0E3EB] pb-3"
        data-purpose="market-category-tabs"
      >
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'font-semibold bg-[#131722] text-white shadow-xs'
                    : 'font-medium text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      </section>
    </div>
  );
};
