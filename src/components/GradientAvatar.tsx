import { generateGradientAvatar } from '../utils/avatar';

interface GradientAvatarProps {
  address: string;
  size?: number;
  className?: string;
}

export function GradientAvatar({ address, size = 24, className = '' }: GradientAvatarProps) {
  const avatarUrl = generateGradientAvatar(address);
  
  return (
    <img
      src={avatarUrl}
      alt=""
      className={`rounded-full flex-shrink-0 ${className}`}
      style={{ width: size, height: size, minWidth: size }}
    />
  );
}
