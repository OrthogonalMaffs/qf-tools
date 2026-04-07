import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldX, Wallet, Loader2 } from 'lucide-react';
import { useRevoke } from '../hooks/useRevoke';
import { Skeleton, EmptyState } from '../components';
import { truncateAddress } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

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

export function Revoke() {
  useDocumentTitle('QFTools — Revoke Approvals');
  const { approvals, loading, error, connect, revoke, walletAddress } = useRevoke();

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-[28px] font-semibold text-white pt-8 mb-1">
          Revoke
        </h1>
        <p className="font-body text-sm text-white/40 mb-8">
          Inspect and revoke ERC-20 token approvals on QF Network
        </p>
      </motion.div>

      {/* Not connected state */}
      {!walletAddress && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <EmptyState
            icon={<ShieldCheck size={48} />}
            title="Check your approvals"
            description="Connect your wallet to see which contracts have permission to spend your tokens."
          />
          <div className="text-center -mt-4">
            <button
              onClick={connect}
              className="text-[13px] font-medium px-3 py-1 rounded-full border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 transition-colors inline-flex items-center gap-1.5"
            >
              <Wallet size={12} />
              Connect Wallet
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton width={120} height={16} className="rounded" />
                  <Skeleton width={60} height={12} className="rounded" />
                </div>
                <Skeleton width={60} height={24} className="rounded-full" />
              </div>
              <div className="mt-1.5">
                <Skeleton width={240} height={12} className="rounded" />
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Error state */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="py-4 border-b border-white/5 mb-4"
        >
          <p className="font-body text-sm text-white/50">{error}</p>
        </motion.div>
      )}

      {/* Connected — results */}
      {walletAddress && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Connected address */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="font-mono text-xs text-white/30">
              {truncateAddress(walletAddress)}
            </span>
          </div>

          {/* Approvals list */}
          {approvals.length === 0 ? (
            <EmptyState
              icon={<ShieldCheck size={48} />}
              title="No active approvals"
              description="This wallet has no outstanding ERC-20 token approvals on QF Network."
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-white">
                  Active Approvals
                </h2>
                <span className="font-body text-sm text-white/30">
                  {approvals.length}
                </span>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                <AnimatePresence mode="popLayout">
                  {approvals.map((approval) => (
                    <motion.div
                      key={`${approval.tokenAddress}:${approval.spender}`}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      className={`py-4 border-b border-white/5 transition-colors duration-200 rounded-lg ${
                        approval.revoking ? 'opacity-50' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* Desktop row */}
                      <div className="hidden sm:flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-body font-semibold text-[15px] text-white">
                              {approval.tokenName}
                            </span>
                            <span className="font-body text-xs text-white/30">
                              {approval.tokenSymbol}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-xs text-white/30">
                            <span>
                              Spender{' '}
                              <span className="text-white/50">
                                {truncateAddress(approval.spender)}
                              </span>
                            </span>
                            <span className="text-white/10">·</span>
                            <span>
                              Allowance{' '}
                              <span className="text-white/50">
                                {approval.allowanceDisplay}
                              </span>
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => revoke(approval.tokenAddress, approval.spender)}
                          disabled={approval.revoking}
                          aria-label={`Revoke ${approval.tokenSymbol} approval for ${truncateAddress(approval.spender)}`}
                          className={`text-[13px] font-medium px-3 py-1 rounded-full border transition-colors inline-flex items-center gap-1.5 flex-shrink-0 ${
                            approval.revoking
                              ? 'border-white/5 text-white/20 cursor-not-allowed'
                              : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'
                          }`}
                        >
                          {approval.revoking ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              Confirming
                            </>
                          ) : (
                            <>
                              <ShieldX size={12} />
                              Revoke
                            </>
                          )}
                        </button>
                      </div>

                      {/* Mobile row */}
                      <div className="sm:hidden">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-body font-semibold text-[14px] text-white">
                              {approval.tokenName}
                            </span>
                            <span className="font-body text-xs text-white/30">
                              {approval.tokenSymbol}
                            </span>
                          </div>
                          <button
                            onClick={() => revoke(approval.tokenAddress, approval.spender)}
                            disabled={approval.revoking}
                            aria-label={`Revoke ${approval.tokenSymbol} approval for ${truncateAddress(approval.spender)}`}
                            className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full border transition-colors inline-flex items-center gap-1 ${
                              approval.revoking
                                ? 'border-white/5 text-white/20 cursor-not-allowed'
                                : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'
                            }`}
                          >
                            {approval.revoking ? (
                              <>
                                <Loader2 size={11} className="animate-spin" />
                                Confirming
                              </>
                            ) : (
                              <>
                                <ShieldX size={11} />
                                Revoke
                              </>
                            )}
                          </button>
                        </div>
                        <div className="space-y-0.5 font-mono text-[11px] text-white/30">
                          <div>
                            Spender{' '}
                            <span className="text-white/50">
                              {truncateAddress(approval.spender, true)}
                            </span>
                          </div>
                          <div>
                            Allowance{' '}
                            <span className="text-white/50">
                              {approval.allowanceDisplay}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </>
  );
}
