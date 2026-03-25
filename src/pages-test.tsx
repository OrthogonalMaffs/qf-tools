import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, PageTransition, ScrollToTop } from './components';
import { Explorer } from './pages/Explorer';
import { AccountView } from './pages/AccountView';
import { Burn } from './pages/Burn';
import { Tokens } from './pages/Tokens';
import { Gas } from './pages/Gas';
import { Accounts } from './pages/Accounts';

export function PagesTest() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
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
    </BrowserRouter>
  );
}

// Make available for testing
if (typeof window !== 'undefined') {
  (window as any).PagesTest = PagesTest;
}
