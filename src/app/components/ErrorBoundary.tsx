import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time exceptions anywhere below it in the tree. Without
 * this, an uncaught error unmounts the whole React tree and leaves a
 * blank white page with nothing but a console message — this shows a
 * readable error instead (and the full stack in dev) so a crash is
 * actually debuggable from the screen itself.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Uncaught render error:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.href = "/";
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const env = (import.meta as unknown as { env?: Record<string, unknown> })
      .env;
    const isDev = Boolean(env?.DEV);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-gray-500 mt-2">
            The page hit an unexpected error instead of showing a blank
            screen.
          </p>

          <pre className="mt-5 text-left text-xs bg-gray-100 rounded-xl p-4 overflow-auto max-h-64 text-red-700 whitespace-pre-wrap">
            {error.message}
            {"\n\n"}
            {error.stack}
          </pre>

          <button
            onClick={this.handleReload}
            className="mt-6 inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }
}
