import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { AuthLayout, Field, PrimaryBtn } from "../../components/auth/AuthUI";
import { useAuth } from "../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email.trim());
      // Pass the email along to the verify screen
      navigate("/auth/verify", { state: { email: email.trim() } });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send the reset code."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Link
        to="/auth/login"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>

      <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
        <KeyRound className="w-7 h-7 text-emerald-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
      <p className="text-gray-500 mt-1 mb-6">
        Enter your email and we'll send you a code to reset your password.
      </p>

      <div className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
            {error}
          </div>
        )}
        <Field
          icon={Mail}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PrimaryBtn onClick={handleSend} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Send reset code <ArrowRight className="w-5 h-5" />
            </>
          )}
        </PrimaryBtn>
      </div>
    </AuthLayout>
  );
}
