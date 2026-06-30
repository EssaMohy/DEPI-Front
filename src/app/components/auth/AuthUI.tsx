import { Leaf } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      {/* decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-11 h-11 rounded-xl  flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Plantera</span>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-emerald-900/5 border border-white/60 p-8">
          {children}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Plantera. All rights reserved.
        </p>
      </div>
    </div>
  );
}

interface FieldProps {
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  trailing?: React.ReactNode;
  error?: string;
}

export function Field({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  trailing,
  error,
}: FieldProps) {
  return (
    <div>
      <div className="relative">
        <Icon
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${
            error ? "text-red-400" : "text-gray-400"
          }`}
        />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-gray-50 focus:bg-white outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          }`}
        />
        {trailing}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface PrimaryBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function PrimaryBtn({ children, onClick, disabled }: PrimaryBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      {children}
    </button>
  );
}
