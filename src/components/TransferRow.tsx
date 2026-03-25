import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Identity } from './Identity';
import { BurnBadge } from './BurnBadge';
import { formatQF, relativeTime } from '../utils/format';
import type { EnrichedTransfer } from '../types';

interface TransferRowProps {
  transfer: EnrichedTransfer;
  className?: string;
}

export function TransferRow({ transfer, className = '' }: TransferRowProps) {
  return (
    <motion.div 
      className={`py-4 border-b border-white/5 -mx-4 px-4 sm:mx-0 sm:px-0 rounded-lg hover:bg-white/[0.02] transition-colors duration-200 ${className}`}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Main row: sender → recipient on the left, amount + burn on the right */}
      <div className="flex items-center justify-between gap-3">
        {/* Identities */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Link to={`/explorer/${transfer.fromName || transfer.from}`} className="min-w-0 hover:opacity-80 transition-opacity">
            <Identity 
              address={transfer.from} 
              name={transfer.fromName} 
              showAvatar={true} 
              size={24}
              truncateName={8}
            />
          </Link>
          <span className="text-white/30 mx-1 flex-shrink-0">→</span>
          <Link to={`/explorer/${transfer.toName || transfer.to}`} className="min-w-0 hover:opacity-80 transition-opacity">
            <Identity 
              address={transfer.to} 
              name={transfer.toName} 
              showAvatar={true} 
              size={24}
              truncateName={8}
            />
          </Link>
        </div>
        
        {/* Amount + burn badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-body font-semibold text-[14px] sm:text-[15px] text-white whitespace-nowrap">
            {formatQF(transfer.amountQF)} <span className="text-white/50">QF</span>
          </span>
          {transfer.isQFPayTransfer && transfer.burnAmount && (
            <BurnBadge amount={transfer.burnAmount} />
          )}
        </div>
      </div>
      
      {/* Metadata row */}
      <div className="mt-1 font-body text-xs text-white/30 whitespace-nowrap">
        Block {transfer.blockNumber} · {relativeTime(transfer.timestamp)}
      </div>
    </motion.div>
  );
}
