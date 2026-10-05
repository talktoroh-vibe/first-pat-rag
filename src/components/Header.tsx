import React, { useState } from 'react';
import { Search, Globe, User, Menu, X, ChevronDown, Check, Bookmark, Bell, Settings, LogIn } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  activeNav?: string;
  onSelectNav?: (item: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAuth,
  activeNav = 'Markets',
  onSelectNav,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const navItems = ['Products', 'Community', 'Markets', 'Brokers', 'More'];
  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E0E3EB] px-4 lg:px-8 py-2.5">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Brand & Search Left Container */}
        <div className="flex items-center gap-6">
          {/* TradingView Geometric Logo */}
          <button
            onClick={() => onSelectNav && onSelectNav('Markets')}
            aria-label="TradingView Home"
            className="flex items-center gap-1.5 focus:outline-none cursor-pointer group"
          >
            <svg
              className="w-8 h-6 text-black group-hover:text-[#2962FF] transition-colors"
              fill="currentColor"
              viewBox="0 0 36 28"
            >
              <path d="M14 22H7V6h7v16zm8-16h-7v22h7V6zm8 7h-7v15h7V13z" />
            </svg>
          </button>

          {/* Global Search Bar Pill */}
          <div className="relative w-48 sm:w-64 lg:w-72">
            <button
              onClick={onOpenSearch}
              type="button"
              className="w-full flex items-center bg-[#F0F3FA] hover:bg-[#E5E9F0] transition-colors rounded-full px-3.5 py-1.5 cursor-pointer text-[#787B86] text-sm group text-left border border-transparent hover:border-[#E0E3EB]"
            >
              <Search className="w-4 h-4 text-[#787B86] group-hover:text-[#131722] transition-colors mr-2.5 shrink-0" />
              <span className="text-xs font-normal truncate">Search (Ctrl+K)</span>
              <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-white border border-[#E0E3EB] rounded px-1.5 py-0.5 text-[#787B86] font-mono shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-[14px] font-medium text-[#131722]">
            {navItems.map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  onClick={() => onSelectNav && onSelectNav(item)}
                  className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#2962FF] font-semibold relative after:content-[""] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-[#2962FF]'
                      : 'text-[#131722] hover:text-[#2962FF]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Tools & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
                setProfileMenuOpen(false);
              }}
              aria-label="Select Language"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-[#F0F3FA] transition-colors text-xs font-medium text-[#131722] cursor-pointer"
              type="button"
            >
              <Globe className="w-4 h-4 text-[#787B86]" />
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-[#787B86]" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E0E3EB] rounded-xl shadow-lg py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[11px] font-semibold text-[#787B86] uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setCurrentLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#F0F3FA] text-[#131722] cursor-pointer"
                  >
                    <span>{l.name}</span>
                    {currentLang === l.code && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Menu Button */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setLangMenuOpen(false);
              }}
              aria-label="Account Menu"
              className="p-2 rounded-full hover:bg-[#F0F3FA] text-[#131722] transition-colors cursor-pointer"
              type="button"
            >
              <User className="w-5 h-5 text-[#787B86] hover:text-[#131722]" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E0E3EB] rounded-xl shadow-lg py-2 z-50 text-xs">
                <div className="px-3.5 py-2 border-b border-[#E0E3EB]">
                  <div className="font-semibold text-sm text-[#131722]">Guest Trader</div>
                  <div className="text-[11px] text-[#787B86]">guest@tradingview.com</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F0F3FA] text-[#131722] text-left cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-[#787B86]" />
                    <span>Watchlist & Bookmarks</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F0F3FA] text-[#131722] text-left cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-[#787B86]" />
                    <span>Price Alerts</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F0F3FA] text-[#131722] text-left cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#787B86]" />
                    <span>Chart Settings</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-[#E0E3EB]">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F0F3FA] text-[#2962FF] font-medium text-left cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign in / Create Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Get Started CTA Button */}
          <button
            onClick={onOpenAuth}
            className="bg-gradient-to-r from-[#2962FF] to-[#8000FF] hover:opacity-95 text-white font-medium text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-full shadow-xs transition-all flex items-center justify-center cursor-pointer whitespace-nowrap active:scale-98"
          >
            Get started
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#F0F3FA] text-[#131722] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E0E3EB] mt-2.5 pt-3 pb-4 space-y-2 px-2 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                onSelectNav && onSelectNav(item);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeNav === item
                  ? 'bg-[#F0F3FA] text-[#2962FF] font-semibold'
                  : 'text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              {item}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E0E3EB] flex items-center justify-between px-3 text-xs text-[#787B86]">
            <span>Language</span>
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setCurrentLang(l.code)}
                  className={`px-2 py-0.5 rounded text-xs ${
                    currentLang === l.code ? 'bg-[#2962FF] text-white font-semibold' : 'hover:bg-[#F0F3FA]'
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
