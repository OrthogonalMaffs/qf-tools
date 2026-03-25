import { useState } from 'react';
import { generateGradientAvatar } from '../utils/avatar';
import { useQNSAvatar } from '../hooks/useQNSAvatar';

interface GradientAvatarProps {
  address: string;
  size?: number;
  className?: string;
  /** Pass a .qf name to attempt loading the QNS profile avatar. Falls back to gradient. */
  name?: string | null;
}

export function GradientAvatar({ address, size = 24, name = null, className = '' }: GradientAvatarProps) {
  const qnsAvatarUrl = useQNSAvatar(name);
  const [imgError, setImgError] = useState(false);
  const gradientUrl = generateGradientAvatar(address);
  
  // Use QNS avatar if available and not errored, otherwise gradient
  const showQNSAvatar = qnsAvatarUrl && !imgError;
  
  return (
    <>
      {showQNSAvatar ? (
        <img
          src={qnsAvatarUrl}
          alt=""
          className={`rounded-full flex-shrink-0 object-cover ${className}`}
          style={{ width: size, height: size, minWidth: size }}
          onError={() => setImgError(true)}
        />
      ) : (
        <img
          src={gradientUrl}
          alt=""
          className={`rounded-full flex-shrink-0 ${className}`}
          style={{ width: size, height: size, minWidth: size }}
        />
      )}
    </>
  );
}
