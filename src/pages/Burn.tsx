import { motion, AnimatePresence } from 'framer-motion';
import { useBurns } from '../hooks/useBurns';
import { Identity, EmptyState, Skeleton, PageTransition } from '../components';
import { formatQF, relativeTime } from '../utils/format';

export function Burn() {
  const { data: burns, loading, error } = useBurns();

  // Calculate totals
  const totalBurned = burns?.reduce((sum, burn) => sum + burn.amount, 0) || 0;
  const qfpayBurned = burns?.filter(b => b.source === 'qfpay').reduce((sum, burn) => sum + burn.amount, 0) || 0;
  const qnsBurned = burns?.filter(b => b.source === 'qns').reduce((sum, burn) => sum + burn.amount, 0) || 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-14">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-16 pb-8"
        >
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
        </motion.div>

        {/* Source Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* QFPay Card */}
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

          {/* QNS Card */}
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
            <div className="h-64 flex items-center justify-center">
              {loading ? (
                <Skeleton width="100%" height="100%" />
              ) : burns && burns.length > 0 ? (
                <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
                  {/* Simple area chart visualization */}
                  <defs>
                    <linearGradient id="burnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E85D25" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#E85D25" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Chart area */}
                  <path
                    d={`M 0,200 ${burns.map((burn, i) => {
                      const x = (i / burns.length) * 400;
                      const y = 200 - (burn.amount / Math.max(...burns.map(b => b.amount))) * 180;
                      return `L ${x},${y}`;
                    }).join(' ')} L 400,200 Z`}
                    fill="url(#burnGradient)"
                  />
                  
                  {/* Chart line */}
                  <path
                    d={`M 0,200 ${burns.map((burn, i) => {
                      const x = (i / burns.length) * 400;
                      const y = 200 - (burn.amount / Math.max(...burns.map(b => b.amount))) * 180;
                      return `L ${x},${y}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#E85D25"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <div className="text-center text-white/30">
                  No burn data available
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Live Burn Feed */}
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
                  <div className="flex items-center gap-2">
                    <Skeleton width={20} height={20} />
                    <Skeleton width={100} height={16} />
                    <Skeleton width={150} height={16} />
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
            <div className="space-y-1">
              {burns?.slice(0, 20).map((burn, index) => (
                <div key={`${burn.id}-${index}`} className="py-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="text-[#E85D25]"
                    >
                      <path d="M12 2C12 2 8 6 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 6 12 2 12 2Z"/>
                    </svg>
                    <span className="font-body font-semibold text-[15px] text-white">
                      {formatQF(burn.amount)} QF burned
                    </span>
                    <span className="font-body text-sm text-white/50">
                      · {burn.source === 'qfpay' ? 'QFPay transfer' : 'QNS registration'}
                    </span>
                    {burn.triggerAccount && (
                      <>
                        <span className="text-white/30">by</span>
                        <Identity 
                          address={burn.triggerAccount} 
                          showAvatar={false} 
                          size={16} 
                          className="text-sm"
                        />
                      </>
                    )}
                  </div>
                  <div className="mt-1 font-body text-xs text-white/30">
                    Block {burn.block} · {relativeTime(Math.floor(new Date(burn.timestamp).getTime() / 1000))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
