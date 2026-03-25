import { motion } from 'framer-motion';
import { GradientAvatar } from './GradientAvatar';
import { QFName } from './QFName';
import { TruncatedAddress } from './TruncatedAddress';

interface IdentityProps {
  address: string;
  name?: string | null;
  showAvatar?: boolean;
  size?: number;
  className?: string;
  /** Max chars for .qf base name before truncating. Default: false (no truncation) */
  truncateName?: number | false;
  /** Use shorter address truncation (4…4). Default: false */
  shortAddress?: boolean;
}

export function Identity({ 
  address, 
  name, 
  showAvatar = true, 
  size = 24, 
  className = '',
  truncateName = false,
  shortAddress = false,
}: IdentityProps) {
  if (name) {
    return (
      <motion.span 
        className={`inline-flex items-center gap-2 min-w-0 ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {showAvatar && <GradientAvatar address={address} size={size} name={name} className="flex-shrink-0" />}
        <QFName 
          name={name} 
          truncate={truncateName}
          className="font-body font-medium text-white text-[14px] md:text-[15px]" 
        />
      </motion.span>
    );
  }
  
  return (
    <span className={`inline-flex items-center min-w-0 ${className}`}>
      <TruncatedAddress address={address} short={shortAddress} />
    </span>
  );
}
