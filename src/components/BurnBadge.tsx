import { formatQF } from '../utils/format';

interface BurnBadgeProps {
  amount: number;
  className?: string;
}

export function BurnBadge({ amount, className = '' }: BurnBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <svg 
        width="12" 
        height="12" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="text-[#E85D25]"
      >
        <path d="M12 2C12 2 8 6 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 6 12 2 12 2Z"/>
      </svg>
      <span className="text-white/30 text-xs font-mono">
        {formatQF(amount)}
      </span>
    </span>
  );
}
