import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { GradientAvatar } from './GradientAvatar';
import { QFName } from './QFName';
import { TruncatedAddress } from './TruncatedAddress';
import { formatQF, relativeTime } from '../utils/format';
import type { EnrichedTransfer } from '../types';

interface Props {
  transfer: EnrichedTransfer | null;
  onClose: () => void;
}

export function TransferDetailModal({ transfer, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!transfer) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [transfer, onClose]);

  return (
    <AnimatePresence>
      {transfer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-[400px] bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-2xl p-6 pointer-events-auto shadow-[0_0_40px_rgba(0,0,0,0.3)]"
            >
              {/* From */}
              <Link
                to={`/explorer/${transfer.fromName || transfer.from}`}
                onClick={onClose}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <GradientAvatar address={transfer.from} size={36} name={transfer.fromName} className="flex-shrink-0" />
                <div className="min-w-0">
                  {transfer.fromName ? (
                    <QFName name={transfer.fromName} className="font-body font-medium text-white text-[15px]" />
                  ) : (
                    <TruncatedAddress address={transfer.from} />
                  )}
                  <div className="font-mono text-[11px] text-white/20 truncate mt-0.5">
                    {transfer.from}
                  </div>
                </div>
              </Link>

              {/* Arrow + Amount */}
              <div className="flex items-center gap-3 my-5 pl-4">
                <span className="text-white/20 text-lg">↓</span>
                <span className="font-body font-semibold text-[17px] text-white">
                  {formatQF(transfer.amountQF)} <span className="text-white/40 font-normal text-sm">QF</span>
                </span>
                {transfer.isQFPayTransfer && transfer.burnAmount && (
                  <span className="inline-flex items-center gap-1 ml-1">
                    <Flame size={13} className="text-[#E85D25]" />
                    <span className="text-white/30 text-xs font-mono">
                      {transfer.burnAmount < 0.001 ? '<0.001' : formatQF(transfer.burnAmount)}
                    </span>
                  </span>
                )}
              </div>

              {/* To */}
              <Link
                to={`/explorer/${transfer.toName || transfer.to}`}
                onClick={onClose}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <GradientAvatar address={transfer.to} size={36} name={transfer.toName} className="flex-shrink-0" />
                <div className="min-w-0">
                  {transfer.toName ? (
                    <QFName name={transfer.toName} className="font-body font-medium text-white text-[15px]" />
                  ) : (
                    <TruncatedAddress address={transfer.to} />
                  )}
                  <div className="font-mono text-[11px] text-white/20 truncate mt-0.5">
                    {transfer.to}
                  </div>
                </div>
              </Link>

              {/* Metadata */}
              <div className="mt-5 pt-4 border-t border-white/[0.05] font-body text-xs text-white/25">
                Block {transfer.blockNumber} · {relativeTime(transfer.timestamp)}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
