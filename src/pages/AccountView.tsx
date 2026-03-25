import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { GradientAvatar, QFName, TruncatedAddress, TransferRow, EmptyState, Skeleton, PageTransition } from '../components';
import { useCopy } from '../hooks/useCopy';
import { useAccount } from '../hooks/useAccount';
import { useTransfers } from '../hooks/useTransfers';
import { formatQF } from '../utils/format';

export function AccountView() {
  const { id } = useParams<{ id: string }>();
  const { copied, copy } = useCopy();
  const { data: accountData, loading, error } = useAccount(id || '');
  const { data: transfers, loading: transfersLoading } = useTransfers(50);

  const accountTransfers = transfers?.filter(
    transfer => transfer.from === id || transfer.to === id
  ) || [];

  if (!id) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0A0A0A] text-white pt-14">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="1"/>
                <path d="M12 8v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <circle cx="12" cy="15" r="1" fill="currentColor"/>
              </svg>
            }
            title="Invalid account"
            description="Please provide a valid address or .qf name."
          />
        </div>
      </div>
    </PageTransition>
    );
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0A0A0A] text-white pt-14">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Hero Section Skeleton */}
          <div className="text-center pt-12 pb-8">
            <Skeleton width={80} height={80} className="rounded-full mx-auto mb-4" />
            <Skeleton width={200} height={36} className="mx-auto mb-2" />
            <Skeleton width={400} height={12} className="mx-auto mb-2" />
            <Skeleton width={300} height={14} className="mx-auto" />
          </div>
          
          {/* Balance Section Skeleton */}
          <div className="text-center mt-6">
            <Skeleton width={200} height={36} className="mx-auto mb-2" />
            <Skeleton width={150} height={13} className="mx-auto" />
          </div>
        </div>
      </div>
    </PageTransition>
    );
  }

  if (error || !accountData?.found) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0A0A0A] text-white pt-14">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="1"/>
                <path d="M12 8v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <circle cx="12" cy="15" r="1" fill="currentColor"/>
              </svg>
            }
            title="Account not found"
            description="This address has no on-chain activity."
          />
        </div>
      </div>
    </PageTransition>
    );
  }

  const account = accountData.balance;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-14">
        <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center pt-12 pb-8"
        >
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-4"
          >
            <GradientAvatar address={account.address} size={80} className="mx-auto" />
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {account.name ? (
              <QFName name={account.name} className="font-display text-[28px] font-semibold" />
            ) : (
              <TruncatedAddress address={account.address} className="text-sm text-white/70" />
            )}
          </motion.div>

          {/* Address Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-1 flex items-center justify-center gap-2"
          >
            <span className="font-mono text-xs text-white/30">
              {account.address}
            </span>
            <button
              onClick={() => copy(account.address)}
              className="text-white/30 hover:text-white transition-colors"
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1"/>
                </svg>
              )}
            </button>
          </motion.div>

          {/* Bio */}
          {account.name && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-2"
            >
              <p className="font-body text-sm text-white/50 max-w-md mx-auto">
                {account.name.includes('deployer') && 'QF Network deployer account'}
                {account.name.includes('qfpay') && 'QFPay — Instant payments on QF Network'}
                {account.name.includes('qns') && 'QF Name Service — Your identity on QF Network'}
                {account.name.includes('qflink') && 'QFLink — On-chain messaging'}
                {account.name.includes('hardwired') && 'Building on QF since day one'}
              </p>
            </motion.div>
          )}

          {/* No-name CTA */}
          {!account.name && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-2"
            >
              <p className="font-body text-xs text-white/30">
                This address doesn't have a .qf name yet.{' '}
                <a 
                  href="https://dotqf.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#00D179] hover:underline"
                >
                  Claim one →
                </a>
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Balance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="text-center mt-6"
        >
          <div className="font-display text-[36px] font-bold text-white">
            {formatQF(account.totalQF)} <span className="text-white/40 font-body text-lg ml-1">QF</span>
          </div>
          <div className="font-body text-[13px] text-white/40 mt-1">
            {formatQF(account.freeQF)} free · {formatQF(account.reservedQF)} reserved
          </div>
          <div className="font-body text-xs text-white/30 mt-0.5">
            {account.nonce} transactions
          </div>
        </motion.div>

        {/* Activity Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-10"
        >
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            Activity
          </h2>
          
          {transfersLoading ? (
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
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
          ) : accountTransfers.length === 0 ? (
            <EmptyState
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              }
              title="No activity yet"
              description="This account hasn't made any transfers yet."
            />
          ) : (
            <div className="space-y-1">
              {accountTransfers.map((transfer, index) => (
                <TransferRow key={`${transfer.blockNumber}-${index}`} transfer={transfer} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
      </div>
    </PageTransition>
  );
}
