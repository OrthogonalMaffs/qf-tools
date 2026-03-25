import { AppRouter } from './AppRouter';
import { testAPI } from './test-api';

function App() {
  // Make test functions available in browser console for testing
  if (typeof window !== 'undefined') {
    (window as any).testAPI = testAPI;
  }

  return <AppRouter />;
}

export default App;
