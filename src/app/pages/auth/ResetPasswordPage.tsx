import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { AuthLayout, Field, PrimaryBtn } from "../../components/auth/AuthUI";
import { useAuth } from "../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/api";

interface LocationState {
  email?: string;
  resetToken?: string;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  const { email, resetToken } = (location.state as LocationState | null) ?? {};

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!email || !resetToken) {
      setError("This reset link has expired. Please start over.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email, resetToken, password);
      navigate("/auth/success");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not reset your password."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {!email || !resetToken ? (
        <Link
          to="/auth/forgot"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Start over
        </Link>
      ) : null}

      <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-emerald-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
      <p className="text-gray-500 mt-1 mb-6">
        Your new password must be different from previous ones.
      </p>

      <div className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
            {error}
          </div>
        )}
        <Field
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
        />
        <Field
          icon={Lock}
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          trailing={
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
        />
        <PrimaryBtn onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Reset password <ArrowRight className="w-5 h-5" />
            </>
          )}
        </PrimaryBtn>
      </div>
    </AuthLayout>
  );
}
