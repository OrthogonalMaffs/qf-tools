import { motion } from 'framer-motion';
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
      className={`py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200 ${className}`}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Identity 
            address={transfer.from} 
            name={transfer.fromName} 
            showAvatar={true} 
            size={24} 
          />
          <span className="text-white/30 mx-2">→</span>
          <Identity 
            address={transfer.to} 
            name={transfer.toName} 
            showAvatar={true} 
            size={24} 
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-body font-semibold text-[15px] text-white text-right">
            {formatQF(transfer.amountQF)} <span className="text-white/50">QF</span>
          </span>
          {transfer.isQFPayTransfer && transfer.burnAmount && (
            <BurnBadge amount={transfer.burnAmount} />
          )}
        </div>
      </div>
      
      <div className="mt-1 font-body text-xs text-white/30">
        Block {transfer.blockNumber} · {relativeTime(transfer.timestamp)}
      </div>
    </motion.div>
  );
}
