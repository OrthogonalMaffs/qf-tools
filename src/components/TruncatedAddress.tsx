import { truncateAddress } from '../utils/format';

interface TruncatedAddressProps {
  address: string;
  className?: string;
}

export function TruncatedAddress({ address, className = '' }: TruncatedAddressProps) {
  return (
    <span className={`font-mono text-sm text-white/50 ${className}`}>
      {truncateAddress(address)}
    </span>
  );
}
