import { motion } from 'framer-motion';
import { EmptyState, PageTransition } from '../components';

export function Gas() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-14">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-[28px] font-semibold text-white pt-8 mb-1">
            Gas
          </h1>
          <p className="font-body text-sm text-white/40 mb-8">
            Real-time gas prices on QF Network
          </p>
        </motion.div>

        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1"/>
            </svg>
          }
          title="Collecting gas data"
          description="Real-time gas prices will appear here as data accumulates."
        />
        </div>
      </div>
    </PageTransition>
  );
}
