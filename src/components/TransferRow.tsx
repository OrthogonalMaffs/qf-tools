import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { Identity } from './Identity';
import { GradientAvatar } from './GradientAvatar';
import { QFName } from './QFName';
import { TransferDetailModal } from './TransferDetailModal';
import { formatQF, relativeTime, truncateAddress } from '../utils/format';
import type { EnrichedTransfer } from '../types';

interface TransferRowProps {
  transfer: EnrichedTransfer;
  className?: string;
}

export function TransferRow({ transfer, className = '' }: TransferRowProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* ── Desktop row (sm+) ── */}
      <motion.div
        className={`hidden sm:block py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200 rounded-lg ${className}`}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Main row */}
        <div className="flex items-center justify-between gap-4">
          {/* Identities */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link
              to={`/explorer/${transfer.fromName || transfer.from}`}
              className="min-w-0 hover:opacity-80 transition-opacity"
            >
              <Identity
                address={transfer.from}
                name={transfer.fromName}
                showAvatar={true}
                size={28}
                truncateName={false}
                shortAddress
              />
            </Link>
            <span className="text-white/20 flex-shrink-0 text-sm">→</span>
            <Link
              to={`/explorer/${transfer.toName || transfer.to}`}
              className="min-w-0 hover:opacity-80 transition-opacity"
            >
              <Identity
                address={transfer.to}
                name={transfer.toName}
                showAvatar={true}
                size={28}
                truncateName={false}
                shortAddress
              />
            </Link>
          </div>

          {/* Amount + burn */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="font-body font-semibold text-[15px] md:text-[16px] text-white whitespace-nowrap">
              {formatQF(transfer.amountQF)} <span className="text-white/40 font-normal">QF</span>
            </span>
            {transfer.isQFPayTransfer && transfer.burnAmount && (
              <span className="inline-flex items-center gap-1 flex-shrink-0">
                <Flame size={13} className="text-[#E85D25] flex-shrink-0" />
                <span className="text-white/30 text-xs font-mono whitespace-nowrap">
                  {transfer.burnAmount < 0.001 ? '<0.001' : formatQF(transfer.burnAmount)}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-1.5 font-body text-xs text-white/25 whitespace-nowrap">
          Block {transfer.blockNumber} · {relativeTime(transfer.timestamp)}
        </div>
      </motion.div>

      {/* ── Mobile compact row (<sm) ── */}
      <motion.button
        onClick={() => setModalOpen(true)}
        className={`sm:hidden w-full text-left py-3.5 border-b border-white/5 active:bg-white/[0.03] transition-colors duration-150 ${className}`}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: avatar + name/address */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <GradientAvatar
              address={transfer.from}
              size={24}
              name={transfer.fromName}
              className="flex-shrink-0"
            />
            <div className="min-w-0">
              {transfer.fromName ? (
                <QFName
                  name={transfer.fromName}
                  truncate={8}
                  className="font-body font-medium text-white text-[14px]"
                />
              ) : (
                <span className="font-mono text-[13px] text-white/50">
                  {truncateAddress(transfer.from, true)}
                </span>
              )}
            </div>
            <span className="text-white/15 text-xs flex-shrink-0">→</span>
            <div className="min-w-0">
              {transfer.toName ? (
                <QFName
                  name={transfer.toName}
                  truncate={8}
                  className="font-body font-medium text-white text-[14px]"
                />
              ) : (
                <span className="font-mono text-[13px] text-white/50">
                  {truncateAddress(transfer.to, true)}
                </span>
              )}
            </div>
          </div>

          {/* Right: amount + optional burn flame */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {transfer.isQFPayTransfer && (
              <Flame size={11} className="text-[#E85D25] flex-shrink-0" />
            )}
            <span className="font-body font-semibold text-[13px] text-white whitespace-nowrap">
              {formatQF(transfer.amountQF)}
            </span>
          </div>
        </div>
      </motion.button>

      {/* Detail modal — only rendered on mobile tap */}
      <TransferDetailModal
        transfer={modalOpen ? transfer : null}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
