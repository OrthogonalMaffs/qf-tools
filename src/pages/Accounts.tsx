import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccounts } from '../hooks/useAccounts';
import { Identity, EmptyState, Skeleton } from '../components';
import { formatQF } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type SortField = 'total' | 'free' | 'transactions';

export function Accounts() {
  const { data: accountsData, loading, error } = useAccounts(200);
  useDocumentTitle('QFTools — Accounts');

  const [sortBy, setSortBy] = useState<SortField>('total');
  const [namedOnly, setNamedOnly] = useState(false);

  const allAccounts = accountsData?.accounts || [];

  // Filter
  const filtered = namedOnly ? allAccounts.filter(a => a.name) : allAccounts;

  // Sort
  const accounts = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'free': return parseFloat(b.freeQF) - parseFloat(a.freeQF);
      case 'transactions': return (b.nonce || 0) - (a.nonce || 0);
      default: return parseFloat(b.totalQF) - parseFloat(a.totalQF);
    }
  });

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
        <p className="font-body text-sm text-white/40 mb-4">
          All funded accounts on QF Network
        </p>

        {/* Sort & Filter Controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          {/* Sort toggles — per spec: subtle text toggles */}
          <div className="flex items-center gap-4 text-[13px] font-medium">
            <span className="text-white/30">Sort by</span>
            {([['total', 'Total Balance'], ['free', 'Free Balance'], ['transactions', 'Transactions']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`transition-colors ${sortBy === key ? 'text-white border-b border-white/50' : 'text-white/30 hover:text-white/60'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Named filter toggle */}
          <button
            onClick={() => setNamedOnly(!namedOnly)}
            className={`text-[13px] font-medium px-3 py-1 rounded-full border transition-colors ${
              namedOnly
                ? 'border-[#00D179]/50 text-[#00D179] bg-[#00D179]/10'
                : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'
            }`}
          >
            .qf names only{namedOnly && ` (${accounts.length})`}
          </button>
        </div>
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
            {accounts.map((account, index) => (
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
                        {sortBy === 'transactions'
                          ? <>{account.nonce || 0} <span className="text-white/50">txns</span></>
                          : <>{formatQF(sortBy === 'free' ? account.freeQF : account.totalQF)} <span className="text-white/50">QF</span></>
                        }
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
