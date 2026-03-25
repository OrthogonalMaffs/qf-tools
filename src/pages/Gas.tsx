import { motion } from 'framer-motion';
import { EmptyState } from '../components';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function Gas() {
  useDocumentTitle('QFTools — Gas Tracker');
  return (
    <>
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
    </>
  );
}
