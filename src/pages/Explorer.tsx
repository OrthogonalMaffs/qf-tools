import { motion } from 'framer-motion';
import { StatsLine } from '../components/StatsLine';
import { SearchBar } from '../components/SearchBar';
import { TransferRow } from '../components/TransferRow';
import { EmptyState, Skeleton, PageTransition } from '../components';
import { useTransfers } from '../hooks/useTransfers';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 }
};

export function Explorer() {
  const { data: transfers, loading, error } = useTransfers(30);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-14">
        <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Stats Line */}
        <div className="mb-8">
          <StatsLine />
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <SearchBar />
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="font-display text-lg font-semibold text-white mt-10 mb-4">
            Activity
          </h2>
          
          {loading ? (
            <div className="space-y-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="py-4 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton width={24} height={24} className="rounded-full" />
                      <Skeleton width={120} height={16} />
                      <span className="text-white/30 mx-2">→</span>
                      <Skeleton width={24} height={24} className="rounded-full" />
                      <Skeleton width={100} height={16} />
                    </div>
                    <Skeleton width={80} height={16} />
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
              title="Unable to connect to QF Network"
              description="Please check your connection and try again."
            />
          ) : transfers.length === 0 ? (
            <EmptyState
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              }
              title="No activity yet"
              description="Transfers will appear here as they happen on QF Network."
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1"
            >
              {transfers.map((transfer, index) => (
                <motion.div key={`${transfer.blockNumber}-${index}`} variants={itemVariants}>
                  <TransferRow transfer={transfer} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        </div>
      </div>
    </PageTransition>
  );
}
