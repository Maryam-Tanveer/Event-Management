import { Component } from "react";

// ─── Error Boundary Component ─────────────────────────────────────────────────
// React class component hai — hooks se Error Boundary nahi banta
// Agar koi bhi child component crash kare, ye fallback UI dikhata hai
// Bina is ke — ek component ki crash se poori app crash ho jaati hai
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF3EC] flex flex-col items-center justify-center gap-6 px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#8b2d3a]/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[#8b2d3a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#2d1a0e] mb-3">
              Something went wrong
            </h1>
            <p className="text-[#6b4c3b] text-sm leading-relaxed mb-8">
              An unexpected error occurred. Please try refreshing the page or going back to the home page.
            </p>
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details className="mb-6 text-left bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="text-red-700 text-xs font-mono cursor-pointer mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="text-red-600 text-xs overflow-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 bg-[#8b2d3a] text-white rounded-full text-sm font-semibold hover:bg-[#6d2330] transition-colors"
              aria-label="Go back to home page"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
