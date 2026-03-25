import { truncateAddress } from '../utils/format';

interface TruncatedAddressProps {
  address: string;
  className?: string;
  /** Use shorter truncation (4...4 instead of 6...6). Default: false */
  short?: boolean;
}

export function TruncatedAddress({ address, className = '', short = false }: TruncatedAddressProps) {
  return (
    <span className={`font-mono text-sm text-white/50 ${className}`} title={address}>
      {truncateAddress(address, short)}
    </span>
  );
}
