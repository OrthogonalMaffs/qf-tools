import { formatQF } from '../utils/format';

interface BurnBadgeProps {
  amount: number;
  className?: string;
}

export function BurnBadge({ amount, className = '' }: BurnBadgeProps) {
  // On very small amounts, show <0.001 for compactness
  const displayAmount = amount < 0.001 ? '<0.001' : formatQF(amount);
  
  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 flex-shrink-0 ${className}`}>
      <svg 
        width="12" 
        height="12" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="text-[#E85D25] flex-shrink-0"
      >
        <path d="M12 2C12 2 8 6 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 6 12 2 12 2Z"/>
      </svg>
      <span className="text-white/30 text-[11px] sm:text-xs font-mono whitespace-nowrap">
        {displayAmount}
      </span>
    </span>
  );
}
