import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on click outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileMenuOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <div ref={menuRef} className="pointer-events-auto relative">
        {/* ───── Main pill ───── */}
        <nav className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-2xl px-4 md:px-6 h-12 flex items-center shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          {/* Wordmark — always visible */}
          <Link
            to="/explorer"
            className="flex items-baseline gap-0.5 hover:opacity-80 transition-opacity duration-200 mr-4 md:mr-2"
          >
            <span className="font-display font-semibold text-[15px] text-white">QF</span>
            <span className="font-display font-semibold text-[15px] text-white/40">Tools</span>
          </Link>

          {/* Desktop divider */}
          <div className="hidden md:block w-px h-4 bg-white/[0.06]" />

          {/* Desktop nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-6 md:gap-8 ml-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-body font-medium text-[13px] transition-all duration-200 py-1 ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right section — spacer pushes to the right */}
          <div className="flex-1" />

          {/* Desktop divider */}
          <div className="hidden md:block w-px h-4 bg-white/[0.06] mr-4" />

          {/* Search trigger — always visible */}
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('open-spotlight'))}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/50 transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9"
                stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            {/* ⌘K badge — desktop only */}
            <div className="hidden md:block text-[10px] font-mono text-white/20 border border-white/[0.08] rounded px-1 py-px">
              ⌘K
            </div>
          </button>

          {/* Three-dot menu button — mobile only */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center ml-3 w-8 h-8 -mr-1 rounded-lg hover:bg-white/[0.05] transition-colors"
            aria-label="Menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/40">
              <circle cx="3" cy="8" r="1.25" fill="currentColor" />
              <circle cx="8" cy="8" r="1.25" fill="currentColor" />
              <circle cx="13" cy="8" r="1.25" fill="currentColor" />
            </svg>
          </button>
        </nav>

        {/* ───── Mobile dropdown ───── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]"
            >
              <div className="py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-5 py-3 font-body text-[14px] transition-colors duration-150 ${
                      isActive(item.path)
                        ? 'text-white bg-white/[0.04]'
                        : 'text-white/50 hover:text-white/70 hover:bg-white/[0.02]'
                    }`}
                  >
                    {item.label}
                    {isActive(item.path) && (
                      <span className="ml-auto w-1 h-1 rounded-full bg-white" />
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
