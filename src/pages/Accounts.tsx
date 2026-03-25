import { motion } from 'framer-motion';
import { useAccounts } from '../hooks/useAccounts';
import { Identity, EmptyState, Skeleton } from '../components';
import { formatQF } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function Accounts() {
  const { data: accountsData, loading, error } = useAccounts(75);
  useDocumentTitle('QFTools — Accounts');

  const accounts = accountsData?.accounts || [];
  const maxBalance = accounts.length > 0 ? Math.max(...accounts.map(a => parseFloat(a.totalQF))) : 0;

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-[28px] font-semibold text-white pt-8 mb-1">
          Accounts
        </h1>
        <p className="font-body text-sm text-white/40 mb-6">
          All funded accounts on QF Network
        </p>
      </motion.div>

        {loading ? (
          <div className="space-y-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="py-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton width={32} height={32} className="rounded-full" />
                    <div>
                      <Skeleton width={120} height={16} className="mb-1" />
                      <Skeleton width={80} height={12} />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton width={100} height={16} className="mb-1" />
                    <Skeleton width={60} height={4} className="rounded-full" />
                  </div>
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
            title="Unable to load accounts"
            description="Please check your connection and try again."
          />
        ) : accounts.length === 0 ? (
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            }
            title="No accounts yet"
            description="Funded accounts will appear here as they join QF Network."
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1"
          >
            {accounts
              .sort((a, b) => parseFloat(b.totalQF) - parseFloat(a.totalQF))
              .map((account, index) => (
                <motion.div
                  key={account.address}
                  variants={itemVariants}
                  className="py-4 border-b border-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <span className="font-mono text-sm text-white/30 w-8">
                        #{index + 1}
                      </span>
                      
                      {/* Avatar + Identity */}
                      <Identity 
                        address={account.address} 
                        name={account.name} 
                        showAvatar={true} 
                        size={32} 
                      />
                    </div>
                    
                    {/* Balance + Relative Bar */}
                    <div className="text-right">
                      <div className="font-body font-semibold text-white">
                        {formatQF(account.totalQF)} <span className="text-white/50">QF</span>
                      </div>
                      {/* Relative bar */}
                      <div className="mt-1 w-32 h-1 rounded-full bg-white/10">
                        <div 
                          className="h-full rounded-full bg-white/10 transition-all duration-300"
                          style={{ 
                            width: maxBalance > 0 ? `${(parseFloat(account.totalQF) / maxBalance) * 100}%` : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        )}
    </>
  );
}
