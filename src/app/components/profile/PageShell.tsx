import { useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf } from "lucide-react";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function PageShell({
  title,
  subtitle,
  children,
  maxWidth = "max-w-2xl",
}: PageShellProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Plantera</span>
          </div>
        </div>
      </header>

      <main className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm shadow-emerald-900/5 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
