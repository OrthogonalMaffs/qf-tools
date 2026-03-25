import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, PageTransition, ScrollToTop, ErrorBoundary } from './components';
import { useGlobalKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Explorer } from './pages/Explorer';
import { AccountView } from './pages/AccountView';
import { Burn } from './pages/Burn';
import { Tokens } from './pages/Tokens';
import { Gas } from './pages/Gas';
import { Accounts } from './pages/Accounts';

function AppRouterInner() {
  useGlobalKeyboardShortcuts();
  
  return (
    <div className="pt-14">
      <Routes>
        <Route path="/" element={<PageTransition><Explorer /></PageTransition>} />
        <Route path="/explorer" element={<PageTransition><Explorer /></PageTransition>} />
        <Route path="/explorer/:id" element={<PageTransition><AccountView /></PageTransition>} />
        <Route path="/tokens" element={<PageTransition><Tokens /></PageTransition>} />
        <Route path="/gas" element={<PageTransition><Gas /></PageTransition>} />
        <Route path="/burn" element={<PageTransition><Burn /></PageTransition>} />
        <Route path="/accounts" element={<PageTransition><Accounts /></PageTransition>} />
      </Routes>
    </div>
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
