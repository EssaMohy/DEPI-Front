import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthLayout, Field, PrimaryBtn } from "../../components/auth/AuthUI";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <AuthLayout>
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 mt-1">
          Sign in to keep your garden thriving
        </p>
      </div>

      <div className="space-y-4">
        <Field
          icon={Mail}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          trailing={
            <button
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
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Remember me
          </label>
          <Link
            to="/auth/forgot"
            className="text-emerald-600 font-medium hover:text-emerald-700"
          >
            Forgot password?
          </Link>
        </div>
        <PrimaryBtn onClick={() => navigate("/dashboard")}>
          Sign in <ArrowRight className="w-5 h-5" />
        </PrimaryBtn>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="text-emerald-600 font-semibold hover:text-emerald-700"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
