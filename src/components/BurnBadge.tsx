import { Flame } from 'lucide-react';
import { formatQF } from '../utils/format';

interface BurnBadgeProps {
  amount: number;
  className?: string;
}

export function BurnBadge({ amount, className = '' }: BurnBadgeProps) {
  const displayAmount = amount < 0.001 ? '<0.001' : formatQF(amount);
  
  return (
    <span className={`inline-flex items-center gap-1 flex-shrink-0 ${className}`}>
      <Flame size={13} className="text-[#E85D25] flex-shrink-0" />
      <span className="text-white/30 text-[11px] sm:text-xs font-mono whitespace-nowrap">
        {displayAmount}
      </span>
    </span>
  );
}
