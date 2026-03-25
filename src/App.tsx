import { AppRouter } from './AppRouter';
import { testAPI } from './test-api';
import { ComponentsTest } from './components-test';
import './App.css';

function App() {
  // Make test functions available in browser console for testing
  if (typeof window !== 'undefined') {
    (window as any).testAPI = testAPI;
    (window as any).ComponentsTest = ComponentsTest;
  }

  return <AppRouter />;
}

export default App;
