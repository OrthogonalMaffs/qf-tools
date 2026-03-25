interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="flex justify-center mb-4 opacity-5">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="font-body text-sm text-white/50 max-w-md mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
