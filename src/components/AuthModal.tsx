import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email || 'trader@tradingview.com');
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] w-full max-w-md overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB]">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-5 text-black" fill="currentColor" viewBox="0 0 36 28">
              <path d="M14 22H7V6h7v16zm8-16h-7v22h7V6zm8 7h-7v15h7V13z" />
            </svg>
            <span className="font-bold text-base text-[#131722]">
              {mode === 'signup' ? 'Get started for free' : 'Sign in to TradingView'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F0F3FA] text-[#787B86] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#787B86] mt-3">
          Join over 50M traders worldwide. Access real-time quotes, multi-asset charting, and technical indicators.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-[#131722] block mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@example.com"
              className="w-full px-3 py-2 border border-[#E0E3EB] rounded-lg text-sm focus:outline-none focus:border-[#2962FF]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#131722] block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-[#E0E3EB] rounded-lg text-sm focus:outline-none focus:border-[#2962FF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#2962FF] to-[#8000FF] hover:opacity-95 transition-all cursor-pointer shadow-xs active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : mode === 'signup' ? 'Create free account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-[#E0E3EB] text-center text-xs text-[#787B86]">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#2962FF] font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#2962FF] font-semibold hover:underline cursor-pointer"
              >
                Create one
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
