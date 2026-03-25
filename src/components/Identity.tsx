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
}

export function Identity({ 
  address, 
  name, 
  showAvatar = true, 
  size = 24, 
  className = '' 
}: IdentityProps) {
  if (name) {
    return (
      <motion.span 
        className={`inline-flex items-center gap-2 ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {showAvatar && <GradientAvatar address={address} size={size} />}
        <QFName name={name} className={`font-body font-medium text-white ${className}`} />
      </motion.span>
    );
  }
  
  return <TruncatedAddress address={address} className={className} />;
}
