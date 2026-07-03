import { useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { AuthLayout, PrimaryBtn } from "../../components/auth/AuthUI";
import { useAuth } from "../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/api";

interface LocationState {
  email?: string;
}

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, forgotPassword } = useAuth();
  const email = (location.state as LocationState | null)?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError(null);
    const code = otp.join("");

    if (!email) {
      setError("Missing email. Please restart the password reset flow.");
      return;
    }
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const resetToken = await verifyOtp(email, code);
      navigate("/auth/reset", { state: { email, resetToken } });
    } catch (err) {
      setError(getApiErrorMessage(err, "That code isn't valid."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError(null);
    setIsResending(true);
    try {
      await forgotPassword(email);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not resend the code."));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      {email ? (
        <button
          onClick={() => navigate("/auth/forgot")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      ) : (
        <Link
          to="/auth/forgot"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      )}

      <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
        <ShieldCheck className="w-7 h-7 text-emerald-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>

      <p className="text-gray-500 mt-1 mb-6">
        We sent a 6-digit code to{" "}
        <span className="font-medium text-gray-700">
          {email || "your email"}
        </span>
      </p>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Responsive OTP Fields */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6 w-full">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              otpRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="
              w-10 h-12
              sm:w-12 sm:h-14
              md:w-14 md:h-16
              text-center
              text-lg sm:text-xl
              font-bold
              rounded-xl
              border border-gray-300
              bg-gray-50
              focus:bg-white
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-500/10
              outline-none
              transition-all
            "
          />
        ))}
      </div>

      <PrimaryBtn onClick={handleVerify} disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Verify code
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </PrimaryBtn>

      <p className="text-center text-sm text-gray-500 mt-6">
        Didn't receive the code?{" "}
        <button
          onClick={handleResend}
          disabled={isResending || !email}
          className="text-emerald-600 font-semibold hover:text-emerald-700 disabled:opacity-50"
        >
          {isResending ? "Resending..." : "Resend"}
        </button>
      </p>
    </AuthLayout>
  );
}
