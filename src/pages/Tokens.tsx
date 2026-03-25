import { motion } from 'framer-motion';
import { EmptyState, PageTransition } from '../components';

export function Tokens() {
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
            Tokens
          </h1>
          <p className="font-body text-sm text-white/40 mb-8">
            Deployed on QF Network
          </p>
        </motion.div>

        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1"/>
              <path d="M12 8v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <circle cx="12" cy="15" r="1" fill="currentColor"/>
            </svg>
          }
          title="No tokens yet"
          description="Tokens will appear here as they're deployed on QF Network."
        />
        </div>
      </div>
    </PageTransition>
  );
}
