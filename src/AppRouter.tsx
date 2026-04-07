import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, PageTransition, ScrollToTop, ErrorBoundary } from './components';
import { SearchModal } from './components/SearchModal';
import { useSpotlight } from './hooks/useKeyboardShortcuts';
import { Explorer } from './pages/Explorer';
import { AccountView } from './pages/AccountView';
import { Burn } from './pages/Burn';
import { Tokens } from './pages/Tokens';
import { Gas } from './pages/Gas';
import { Accounts } from './pages/Accounts';
import { Revoke } from './pages/Revoke';

function AppRouterInner() {
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  const openSpotlight = useCallback(() => setSpotlightOpen(true), []);
  const closeSpotlight = useCallback(() => setSpotlightOpen(false), []);

  useSpotlight(openSpotlight);

  // Listen for nav bar's search button click
  useEffect(() => {
    const handler = () => openSpotlight();
    document.addEventListener('open-spotlight', handler);
    return () => document.removeEventListener('open-spotlight', handler);
  }, [openSpotlight]);

  return (
    <>
      <main className="max-w-[1440px] mx-auto pt-20 px-6 md:px-20 lg:px-[124px] pb-20">
        <Routes>
          <Route path="/" element={<PageTransition><Explorer /></PageTransition>} />
          <Route path="/explorer" element={<PageTransition><Explorer /></PageTransition>} />
          <Route path="/explorer/accounts" element={<PageTransition><Accounts /></PageTransition>} />
          <Route path="/explorer/:id" element={<PageTransition><AccountView /></PageTransition>} />
          <Route path="/tokens" element={<PageTransition><Tokens /></PageTransition>} />
          <Route path="/gas" element={<PageTransition><Gas /></PageTransition>} />
          <Route path="/burn" element={<PageTransition><Burn /></PageTransition>} />
          <Route path="/revoke" element={<PageTransition><Revoke /></PageTransition>} />
          <Route path="/accounts" element={<PageTransition><Accounts /></PageTransition>} />
        </Routes>
      </main>
      <SearchModal isOpen={spotlightOpen} onClose={closeSpotlight} />
    </>
  );
}

export function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <AppRouterInner />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
