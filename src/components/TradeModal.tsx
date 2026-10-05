import React, { useState } from 'react';
import { Instrument } from '../types/market';
import { X, CheckCircle2, DollarSign } from 'lucide-react';

interface TradeModalProps {
  instrument: Instrument | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  instrument,
  onClose,
  onSuccess,
}) => {
  if (!instrument) return null;

  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [shares, setShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(instrument.lastPrice);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const price = orderType === 'MARKET' ? instrument.lastPrice : limitPrice;
  const estimatedTotal = shares * price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSuccess(`Order placed: ${orderSide} ${shares} ${instrument.ticker} at $${price.toFixed(2)}`);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E3EB]">
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: instrument.badgeBgColor }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
            >
              {instrument.badgeText}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#131722]">{instrument.ticker}</h3>
              <p className="text-xs text-[#787B86] tabular-nums">Market: ${instrument.lastPrice.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F0F3FA] text-[#787B86] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#089981] mx-auto animate-bounce" />
            <h4 className="font-bold text-lg text-[#131722]">Order Executed</h4>
            <p className="text-xs text-[#787B86]">
              Simulated {orderSide} order for {shares} shares of {instrument.ticker} has been placed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#F0F3FA] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setOrderSide('BUY')}
                className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  orderSide === 'BUY'
                    ? 'bg-[#089981] text-white shadow-xs'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setOrderSide('SELL')}
                className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  orderSide === 'SELL'
                    ? 'bg-[#F23645] text-white shadow-xs'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                SELL
              </button>
            </div>

            {/* Order Type */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#787B86] font-medium">Order Type</span>
              <div className="flex gap-1">
                {(['MARKET', 'LIMIT'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOrderType(t)}
                    className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                      orderType === t ? 'bg-[#131722] text-white' : 'bg-[#F0F3FA] text-[#787B86]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#131722] flex justify-between">
                <span>Quantity</span>
                <span className="text-[#787B86]">Units</span>
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={shares}
                onChange={(e) => setShares(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-[#E0E3EB] rounded-lg text-sm font-semibold tabular-nums focus:outline-none focus:border-[#2962FF]"
              />
            </div>

            {/* Limit Price if selected */}
            {orderType === 'LIMIT' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#131722] flex justify-between">
                  <span>Limit Price ($)</span>
                  <span className="text-[#787B86]">USD</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E0E3EB] rounded-lg text-sm font-semibold tabular-nums focus:outline-none focus:border-[#2962FF]"
                />
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#787B86]">
                <span>Execution Price</span>
                <span className="tabular-nums font-medium text-[#131722]">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#787B86]">
                <span>Broker Commission</span>
                <span className="tabular-nums font-medium text-[#089981]">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#131722] pt-1.5 border-t border-[#E0E3EB]">
                <span>Estimated Value</span>
                <span className="tabular-nums">
                  ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all cursor-pointer shadow-xs active:scale-98 ${
                orderSide === 'BUY' ? 'bg-[#089981] hover:bg-[#077d6a]' : 'bg-[#F23645] hover:bg-[#d62635]'
              }`}
            >
              Submit {orderSide} Order
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
