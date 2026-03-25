import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useBurns } from '../hooks/useBurns';
import { Identity, EmptyState, Skeleton, BurnDetailModal } from '../components';
import { formatQF, relativeTime } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { BurnEvent } from '../types';

// Protocol color mapping for burn source pills
const PROTOCOL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  qfpay: { label: 'QFPay', color: '#0052FF', bg: 'rgba(0, 82, 255, 0.12)' },
  qns: { label: 'QNS', color: '#00D179', bg: 'rgba(0, 209, 121, 0.12)' },
  qflink: { label: 'QFLink', color: '#0991B2', bg: 'rgba(9, 145, 178, 0.12)' },
  provd: { label: 'Provd', color: '#FF3131', bg: 'rgba(255, 49, 49, 0.12)' },
  nucleusx: { label: 'NucleusX', color: '#902EEF', bg: 'rgba(144, 46, 239, 0.12)' },
};

function getProtocolConfig(source: string) {
  return PROTOCOL_CONFIG[source] || { label: source, color: '#888888', bg: 'rgba(136, 136, 136, 0.12)' };
}

export function Burn() {
  const { data: burns, loading, error } = useBurns();
  useDocumentTitle('QFTools — Burn Dashboard');

  const totalBurned = burns?.reduce((sum, burn) => sum + burn.amount, 0) || 0;
  const qfpayBurned = burns?.filter(b => b.source === 'qfpay').reduce((sum, burn) => sum + burn.amount, 0) || 0;
  const qnsBurned = burns?.filter(b => b.source === 'qns').reduce((sum, burn) => sum + burn.amount, 0) || 0;
  const [selectedBurn, setSelectedBurn] = useState<{ burn: BurnEvent; protocol: { label: string; color: string; bg: string } } | null>(null);

  return (
    <>
      {/* Hero Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center pt-16 pb-8"
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Skeleton width={220} height={48} className="rounded-lg" />
            <Skeleton width={120} height={16} className="rounded" />
          </div>
        ) : (
          <>
            <div className="font-display text-[48px] font-bold text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={totalBurned}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {formatQF(totalBurned)}
                </motion.div>
              </AnimatePresence>
              <span className="text-white/40 font-body text-lg ml-1">QF</span>
            </div>
            <div className="font-body text-sm text-white/40 mt-2">
              QF burned forever
            </div>
          </>
        )}
      </motion.div>

      {/* Source Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {loading ? (
          <>
            <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
              <Skeleton width={140} height={12} className="rounded mb-3" />
              <Skeleton width={180} height={28} className="rounded mb-2" />
              <Skeleton width={160} height={12} className="rounded" />
            </div>
            <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
              <Skeleton width={140} height={12} className="rounded mb-3" />
              <Skeleton width={180} height={28} className="rounded mb-2" />
              <Skeleton width={160} height={12} className="rounded" />
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#111111] border border-white/5 rounded-xl p-6 border-t-2 border-t-[#0052FF]">
              <div className="font-body text-xs text-white/40 uppercase tracking-wider mb-2">
                QFPAY TRANSFERS
              </div>
              <div className="font-display text-2xl font-semibold text-white mt-2">
                {formatQF(qfpayBurned)} QF
              </div>
              <div className="font-body text-xs text-white/30 mt-1">
                0.1% of every transfer
              </div>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-xl p-6 border-t-2 border-t-[#00D179]">
              <div className="font-body text-xs text-white/40 uppercase tracking-wider mb-2">
                QNS REGISTRATIONS
              </div>
              <div className="font-display text-2xl font-semibold text-white mt-2">
                {formatQF(qnsBurned)} QF
              </div>
              <div className="font-body text-xs text-white/30 mt-1">
                5% of every registration
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Burn Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">
            Burn History
          </h3>
          <div className="h-48 flex flex-col items-center justify-center gap-2">
            <Flame size={24} className="text-white/10" />
            <span className="font-body text-sm text-white/20">
              Chart available soon
            </span>
          </div>
        </div>
      </motion.div>

      {/* Recent Burns Feed — Redesigned three-column layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8"
      >
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          Recent Burns
        </h2>
        
        {loading ? (
          <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="py-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <Skeleton width={140} height={16} />
                  <Skeleton width={80} height={24} />
                  <Skeleton width={120} height={16} />
                </div>
                <div className="mt-1">
                  <Skeleton width={200} height={12} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="1"/>
                <path d="M12 8v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <circle cx="12" cy="15" r="1" fill="currentColor"/>
              </svg>
            }
            title="Unable to load burn data"
            description="Please check your connection and try again."
          />
        ) : burns && burns.length === 0 ? (
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 9c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" stroke="currentColor" strokeWidth="1"/>
                <path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" stroke="currentColor" strokeWidth="1"/>
              </svg>
            }
            title="No burns yet"
            description="Burn events will appear here as they happen on QF Network."
          />
        ) : (
          <div className="space-y-0">
            {burns?.slice(0, 20).map((burn, index) => {
              const protocol = getProtocolConfig(burn.source);
              return (
                <div key={`${burn.id}-${index}`}>
                  {/* ── Desktop row (sm+) ── */}
                  <div className="hidden sm:block py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200 rounded-lg">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Flame size={15} className="text-[#E85D25] flex-shrink-0" />
                        <span className="font-body font-semibold text-[15px] md:text-[16px] text-white whitespace-nowrap">
                          {formatQF(burn.amount)} <span className="text-white/40 font-normal">QF</span>
                        </span>
                      </div>
                      <span
                        className="font-body text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                        style={{ color: protocol.color, backgroundColor: protocol.bg }}
                      >
                        {protocol.label}
                      </span>
                      <div className="flex items-center justify-end min-w-0 flex-1">
                        {burn.triggerAccount ? (
                          <Identity
                            address={burn.triggerAccount}
                            showAvatar={false}
                            size={16}
                            className="text-sm"
                            truncateName={10}
                            shortAddress
                          />
                        ) : (
                          <span className="text-white/20 text-sm">—</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-1.5 font-body text-xs text-white/25">
                      Block {burn.block} · {relativeTime(Math.floor(new Date(burn.timestamp).getTime() / 1000))}
                    </div>
                  </div>

                  {/* ── Mobile compact row (<sm) ── */}
                  <button
                    onClick={() => setSelectedBurn({ burn, protocol })}
                    className="sm:hidden w-full text-left py-3.5 border-b border-white/5 active:bg-white/[0.03] transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Flame size={13} className="text-[#E85D25] flex-shrink-0" />
                        <span className="font-body font-semibold text-[14px] text-white whitespace-nowrap">
                          {formatQF(burn.amount)}
                        </span>
                      </div>
                      <span
                        className="font-body text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                        style={{ color: protocol.color, backgroundColor: protocol.bg }}
                      >
                        {protocol.label}
                      </span>
                      <span className="font-body text-xs text-white/20 flex-shrink-0">
                        {relativeTime(Math.floor(new Date(burn.timestamp).getTime() / 1000))}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Burn detail modal — mobile */}
      <BurnDetailModal
        burn={selectedBurn?.burn ?? null}
        protocol={selectedBurn?.protocol ?? null}
        onClose={() => setSelectedBurn(null)}
      />
    </>
  );
}
