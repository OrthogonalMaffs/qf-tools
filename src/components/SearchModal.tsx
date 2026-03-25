import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GradientAvatar } from './GradientAvatar';
import { useAccounts } from '../hooks/useAccounts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: accountsData } = useAccounts(200);

  const accounts = accountsData?.accounts || [];

  const filtered = query.length > 0
    ? accounts.filter(a => {
        const q = query.toLowerCase();
        return (
          a.name?.toLowerCase().includes(q) ||
          a.address.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback((account: typeof accounts[0]) => {
    const id = account.name || account.address;
    navigate(`/explorer/${id}`);
    onClose();
  }, [navigate, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0 && filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      } else if (query.trim()) {
        navigate(`/explorer/${query.trim()}`);
        onClose();
      }
    }
  };

  const renderName = (name: string) => {
    const base = name.endsWith('.qf') ? name.slice(0, -3) : name;
    return (
      <span className="font-body font-medium text-white">
        {base}<span className="text-[#00D179]">.qf</span>
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal container */}
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[min(20vh,160px)] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-[520px] bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-2xl overflow-hidden pointer-events-auto shadow-[0_0_40px_rgba(0,0,0,0.3)]"
            >
              {/* Search input row */}
              <div className="flex items-center h-14 px-4 border-b border-white/[0.06]">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-white/30 shrink-0 mr-3">
                  <path
                    d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9"
                    stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search name, address, or block..."
                  className="flex-1 bg-transparent border-none outline-none font-body text-[15px] text-white placeholder:text-white/25"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={onClose}
                  className="text-[10px] font-mono text-white/30 border border-white/[0.08] rounded px-1.5 py-0.5 ml-2 hover:text-white/50 hover:border-white/15 transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <AnimatePresence mode="wait">
                {query.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    {filtered.length > 0 ? (
                      <div className="py-2 max-h-[320px] overflow-y-auto">
                        {filtered.map((account, i) => (
                          <button
                            key={account.address}
                            onClick={() => handleSelect(account)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              i === selectedIndex
                                ? 'bg-white/[0.04]'
                                : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <GradientAvatar address={account.address} size={28} name={account.name} />
                            <div className="flex flex-col min-w-0">
                              {account.name ? (
                                <>
                                  {renderName(account.name)}
                                  <span className="font-mono text-[11px] text-white/20 truncate mt-0.5">
                                    {account.address}
                                  </span>
                                </>
                              ) : (
                                <span className="font-mono text-sm text-white/50 truncate">
                                  {account.address}
                                </span>
                              )}
                            </div>
                            <span className="ml-auto font-body text-xs text-white/20 shrink-0">
                              {parseFloat(account.totalQF).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })} QF
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-10 text-center">
                        <p className="font-body text-sm text-white/25">No results for "{query}"</p>
                        <p className="font-body text-xs text-white/15 mt-1">Press Enter to search anyway</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer hint (when no query) */}
              {!query && (
                <div className="px-4 py-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-4 text-[11px] font-body text-white/20">
                    <span className="flex items-center gap-1">
                      <kbd className="font-mono border border-white/[0.08] rounded px-1 py-px">↑</kbd>
                      <kbd className="font-mono border border-white/[0.08] rounded px-1 py-px">↓</kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="font-mono border border-white/[0.08] rounded px-1 py-px">↵</kbd>
                      select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="font-mono border border-white/[0.08] rounded px-1 py-px">esc</kbd>
                      close
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
