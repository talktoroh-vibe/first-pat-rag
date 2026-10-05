import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);

  const modalContent: Record<string, string> = {
    'Terms of Service':
      'These Terms of Service govern your access to and use of TradingView financial charts, technical indicators, and market analytics platform.',
    'Privacy Policy':
      'Your privacy is critical to us. We never sell your personal information or trading strategies to third parties.',
    'Disclaimer':
      'Market quotes are real-time or delayed by exchange requirements. All trading involves risk. Past performance of financial assets does not guarantee future results.',
  };

  return (
    <>
      <footer className="border-t border-[#E0E3EB] bg-white mt-12 py-6 text-xs text-[#787B86]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2025 TradingView</span>
            <button
              onClick={() => setModalTitle('Terms of Service')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setModalTitle('Privacy Policy')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalTitle('Disclaimer')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
          </div>
          <div>
            <span>Market quotes are real-time or delayed by exchange requirements.</span>
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      {modalTitle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setModalTitle(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-[#E0E3EB] w-full max-w-md p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB]">
              <h4 className="font-bold text-base text-[#131722]">{modalTitle}</h4>
              <button
                onClick={() => setModalTitle(null)}
                className="p-1 rounded-full hover:bg-[#F0F3FA] text-[#787B86] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-4 text-xs text-[#787B86] leading-relaxed">
              {modalContent[modalTitle]}
            </p>
            <div className="mt-5 text-right">
              <button
                onClick={() => setModalTitle(null)}
                className="px-4 py-1.5 rounded-lg bg-[#131722] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
