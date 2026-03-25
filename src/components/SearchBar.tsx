import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const placeholders = [
  "Search a .qf name...",
  "Search an address...",
  "Search a block number...",
];

export function SearchBar({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if it's a .qf name
    if (query.endsWith('.qf')) {
      navigate(`/explorer/${query}`);
    } 
    // Check if it looks like an address (starts with 5 and is reasonably long)
    else if (query.startsWith('5') && query.length > 10) {
      navigate(`/explorer/${query}`);
    }
    // Check if it's a block number
    else if (/^\d+$/.test(query)) {
      // For now, navigate to explorer with block search
      navigate(`/explorer?block=${query}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative bg-[#111111] border border-white/10 rounded-xl h-14 px-5 focus-within:border-white/20 transition-colors duration-200">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholders[placeholderIndex]}
          className="w-full h-full bg-transparent text-white placeholder:text-white/30 font-body focus:outline-none"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9"
              stroke="currentColor"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </form>
  );
}
