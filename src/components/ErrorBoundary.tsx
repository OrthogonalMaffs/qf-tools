import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="1"/>
                <path d="M12 8v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <circle cx="12" cy="15" r="1" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="font-display text-xl font-semibold text-white mb-2">
              Something went wrong
            </h1>
            <p className="font-body text-sm text-white/50 mb-6">
              We encountered an unexpected error. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-black rounded-lg font-body text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
