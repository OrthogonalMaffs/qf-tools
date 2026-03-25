import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { Identity } from './Identity';
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
      {/* Main row */}
      <div className="flex items-center justify-between gap-4">
        {/* Identities — fixed alignment */}
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
  );
}
