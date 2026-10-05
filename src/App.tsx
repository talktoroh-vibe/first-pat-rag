import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IndicesCards } from './components/IndicesCards';
import { MarketsTable } from './components/MarketsTable';
import { ChartModal } from './components/ChartModal';
import { SearchModal } from './components/SearchModal';
import { TradeModal } from './components/TradeModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { MarketCategory, Instrument, IndexSummaryCard } from './types/market';
import { categoryCardsData, allInstruments, marketRegions } from './data/marketsData';
import { CheckCircle2, Bookmark, BarChart3, Users, Briefcase, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('indices');
  const [selectedRegion, setSelectedRegion] = useState<string>('us');
  const [activeNav, setActiveNav] = useState<string>('Markets');
  
  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [tradeInstrument, setTradeInstrument] = useState<Instrument | null>(null);

  // Watchlist
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'BTCUSD', 'AAPL'];
    } catch {
      return ['NVDA', 'BTCUSD', 'AAPL'];
    }
  });

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live price tick state
  const [instruments, setInstruments] = useState<Instrument[]>(allInstruments);
  const [cardsData, setCardsData] = useState<Record<MarketCategory, IndexSummaryCard[]>>(categoryCardsData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLiveEnabled, setIsLiveEnabled] = useState(true);

  // Persist watchlist
  const handleToggleWatchlist = (ticker: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(ticker);
      const next = exists ? prev.filter((t) => t !== ticker) : [...prev, ticker];
      try {
        localStorage.setItem('tv_watchlist', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      showToast(exists ? `Removed ${ticker} from watchlist` : `Added ${ticker} to watchlist`);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Simulate subtle real-time price ticks
  useEffect(() => {
    if (!isLiveEnabled) return;

    const interval = setInterval(() => {
      // Pick a random instrument to slightly fluctuate
      setInstruments((prev) => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const target = prev[randomIndex];
        const deltaPercent = (Math.random() - 0.49) * 0.2; // -0.1% to +0.1%
        const deltaValue = target.lastPrice * (deltaPercent / 100);
        const newPrice = Number(Math.max(0.01, target.lastPrice + deltaValue).toFixed(target.lastPrice < 10 ? 4 : 2));
        const newChangeVal = Number((target.changeValue + deltaValue).toFixed(2));
        const newChangePct = Number((target.changePercent + deltaPercent).toFixed(2));

        const updated = [...prev];
        updated[randomIndex] = {
          ...target,
          lastPrice: newPrice,
          changeValue: newChangeVal,
          changePercent: newChangePct,
          high: Math.max(target.high, newPrice),
          low: Math.min(target.low, newPrice),
        };
        return updated;
      });

      // Also gently tick active category cards
      setCardsData((prev) => {
        const currentCards = prev[selectedCategory] || [];
        if (currentCards.length === 0) return prev;
        const randomCardIdx = Math.floor(Math.random() * currentCards.length);
        const card = currentCards[randomCardIdx];
        const delta = (Math.random() - 0.49) * (card.lastPrice * 0.0005);
        const newPrice = Number((card.lastPrice + delta).toFixed(card.lastPrice < 10 ? 4 : 2));

        const updatedCards = [...currentCards];
        updatedCards[randomCardIdx] = {
          ...card,
          lastPrice: newPrice,
          changeValue: Number((card.changeValue + delta).toFixed(2)),
        };

        return {
          ...prev,
          [selectedCategory]: updatedCards,
        };
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveEnabled, selectedCategory]);

  // Manual refresh prices handler
  const handleRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      showToast('Market quotes updated');
    }, 600);
  };

  // Filter table instruments
  // If category is indices, show the classic trending cross-asset instruments as in screenshot
  // Otherwise, filter by category or prioritize category items
  const displayedInstruments = React.useMemo(() => {
    if (selectedCategory === 'indices') {
      return instruments;
    }
    const catItems = instruments.filter((i) => i.category === selectedCategory);
    if (catItems.length > 0) {
      return [...catItems, ...instruments.filter((i) => i.category !== selectedCategory)];
    }
    return instruments;
  }, [selectedCategory, instruments]);

  const activeRegion = marketRegions.find((r) => r.id === selectedRegion) || marketRegions[0];
  const marketStatus = `${activeRegion.name} ${activeRegion.status === 'Open' ? 'Markets Open' : activeRegion.status}`;

  const handleCardInstrumentSelect = (ticker: string) => {
    const found = instruments.find((i) => i.ticker === ticker);
    if (found) {
      setSelectedInstrument(found);
    } else {
      // Find card details and create temporary instrument
      const card = (cardsData[selectedCategory] || []).find((c) => c.ticker === ticker);
      if (card) {
        setSelectedInstrument({
          id: card.id,
          ticker: card.ticker,
          name: card.name,
          category: selectedCategory,
          lastPrice: card.lastPrice,
          changePercent: card.changePercent,
          changeValue: card.changeValue,
          high: card.lastPrice * 1.01,
          low: card.lastPrice * 0.99,
          open: card.lastPrice,
          prevClose: card.lastPrice - card.changeValue,
          volume: '1.2B',
          technicalRating: card.changePercent >= 0 ? 'Buy' : 'Sell',
          badgeText: card.badgeText,
          badgeBgColor: card.badgeBgColor,
          trend: card.trend,
          sparkline: [card.lastPrice * 0.99, card.lastPrice * 1.005, card.lastPrice],
        });
      }
    }
  };

  return (
    <div className="bg-white text-[#131722] font-sans antialiased min-h-screen flex flex-col selection:bg-blue-100 selection:text-[#2962FF]">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#131722] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#089981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        activeNav={activeNav}
        onSelectNav={(item) => setActiveNav(item)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 lg:px-8 py-8 space-y-8">
        {/* If user clicked other top nav links, show contextual tab or return to Markets */}
        {activeNav !== 'Markets' ? (
          <div className="py-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 bg-[#F0F3FA] rounded-full flex items-center justify-center mx-auto text-[#2962FF]">
              {activeNav === 'Products' && <BarChart3 className="w-6 h-6" />}
              {activeNav === 'Community' && <Users className="w-6 h-6" />}
              {activeNav === 'Brokers' && <Briefcase className="w-6 h-6" />}
              {activeNav === 'More' && <Sparkles className="w-6 h-6" />}
            </div>
            <h2 className="text-2xl font-bold text-[#131722]">{activeNav} Hub</h2>
            <p className="text-xs text-[#787B86]">
              Explore TradingView {activeNav.toLowerCase()} including SuperCharts, social trade ideas, broker integrations, and screener toolsets.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveNav('Markets')}
                className="bg-[#2962FF] hover:bg-[#1E4BD8] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Back to Markets Overview
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Title Section & Category Filter Tabs */}
            <HeroSection
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              selectedRegion={selectedRegion}
              onSelectRegion={(reg) => setSelectedRegion(reg)}
            />

            {/* Quick Indices Summary Cards Grid */}
            <IndicesCards
              cards={cardsData[selectedCategory] || categoryCardsData.indices}
              category={selectedCategory}
              onSelectInstrument={handleCardInstrumentSelect}
              marketStatusText={marketStatus}
              isLiveUpdating={isLiveEnabled}
            />

            {/* Most Active & Trending Table */}
            <MarketsTable
              instruments={displayedInstruments}
              onSelectInstrument={(inst) => setSelectedInstrument(inst)}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onRefreshPrices={handleRefresh}
              isUpdating={isUpdating}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Symbol Chart Modal */}
      <ChartModal
        instrument={selectedInstrument}
        onClose={() => setSelectedInstrument(null)}
        isWatchlisted={selectedInstrument ? watchlist.includes(selectedInstrument.ticker) : false}
        onToggleWatchlist={handleToggleWatchlist}
        onOpenTrade={(inst) => {
          setSelectedInstrument(null);
          setTradeInstrument(inst);
        }}
      />

      {/* Global Search Dialog (Ctrl+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        instruments={instruments}
        onSelectInstrument={(inst) => setSelectedInstrument(inst)}
      />

      {/* Paper Trading Simulation Modal */}
      <TradeModal
        instrument={tradeInstrument}
        onClose={() => setTradeInstrument(null)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Auth / Get Started Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(email) => showToast(`Welcome back, ${email}`)}
      />
    </div>
  );
}
