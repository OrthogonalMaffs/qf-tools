interface QFNameProps {
  name: string;
  className?: string;
}

export function QFName({ name, className = '' }: QFNameProps) {
  const base = name.endsWith('.qf') ? name.slice(0, -3) : name;
  
  return (
    <span className={`${className}`}>
      {base}<span className="text-[#00D179]">.qf</span>
    </span>
  );
}
