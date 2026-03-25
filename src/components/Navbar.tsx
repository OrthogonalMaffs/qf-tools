import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/explorer', label: 'Explorer' },
    { path: '/tokens', label: 'Tokens' },
    { path: '/gas', label: 'Gas' },
    { path: '/burn', label: 'Burn' },
  ];

  const isActive = (path: string) => {
    if (path === '/explorer') {
      return location.pathname === '/' || location.pathname.startsWith('/explorer');
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-white/5">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link 
          to="/explorer" 
          className="flex items-baseline gap-1 hover:opacity-80 transition-opacity duration-200"
        >
          <span className="font-display font-semibold text-base text-white">QF</span>
          <span className="font-display font-semibold text-base text-white/50">Tools</span>
        </Link>
        
        <div className="flex items-center gap-6 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative font-body font-medium text-sm transition-all duration-200 ${
                isActive(item.path) 
                  ? 'text-white' 
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              {item.label}
              {isActive(item.path) && (
                <motion.div 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                  style={{ width: '4px', height: '4px' }}
                  layoutId="activeNav"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
