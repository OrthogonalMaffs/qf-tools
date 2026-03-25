interface QFNameProps {
  name: string;
  className?: string;
  /** Max characters for the base name before truncating. Pass false to disable. Default: false */
  truncate?: number | false;
}

export function QFName({ name, className = '', truncate = false }: QFNameProps) {
  const base = name.endsWith('.qf') ? name.slice(0, -3) : name;
  
  const displayBase = truncate && base.length > truncate
    ? base.slice(0, truncate - 1) + '…'
    : base;
  
  return (
    <span className={className} title={name}>
      {displayBase}<span className="text-[#00D179]">.qf</span>
    </span>
  );
}
