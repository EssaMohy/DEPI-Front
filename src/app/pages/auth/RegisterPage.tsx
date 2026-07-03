import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { AuthLayout, Field, PrimaryBtn } from "../../components/auth/AuthUI";
import { useAuth } from "../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/api";
import { DASHBOARD_PATH } from "../../../lib/navigation";

interface FormState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) nextErrors.firstName = "Required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Required.";
    if (!form.username.trim()) nextErrors.username = "Required.";
    if (!form.email.trim()) nextErrors.email = "Required.";
    if (!form.password || form.password.length < 8) {
      nextErrors.password = "Must be at least 8 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!agreed) {
      setFormError("Please agree to the Terms and Privacy Policy.");
      return;
    }
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        userName: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate(DASHBOARD_PATH, { replace: true });
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Could not create your account."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="text-gray-500 mt-1">
          Start your plant care journey today
        </p>
      </div>

      <div className="space-y-4">
        {formError && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field
            icon={User}
            placeholder="First name"
            value={form.firstName}
            onChange={update("firstName")}
            error={errors.firstName}
          />
          <Field
            icon={User}
            placeholder="Last name"
            value={form.lastName}
            onChange={update("lastName")}
            error={errors.lastName}
          />
        </div>

        <Field
          icon={AtSign}
          placeholder="Username"
          value={form.username}
          onChange={update("username")}
          error={errors.username}
        />

        <Field
          icon={Mail}
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
        />

        <Field
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
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

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          I agree to the{" "}
          <span className="text-emerald-600 font-medium">Terms</span> and{" "}
          <span className="text-emerald-600 font-medium">Privacy Policy</span>
        </label>

        <PrimaryBtn onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create account <ArrowRight className="w-5 h-5" />
            </>
          )}
        </PrimaryBtn>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-emerald-600 font-semibold hover:text-emerald-700"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
