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
} from "lucide-react";
import { AuthLayout, Field, PrimaryBtn } from "../../components/auth/AuthUI";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

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
        <div className="grid grid-cols-2 gap-3">
          <Field
            icon={User}
            placeholder="First name"
            value={form.firstName}
            onChange={update("firstName")}
          />
          <Field
            icon={User}
            placeholder="Last name"
            value={form.lastName}
            onChange={update("lastName")}
          />
        </div>

        <Field
          icon={AtSign}
          placeholder="Username"
          value={form.username}
          onChange={update("username")}
        />

        <Field
          icon={Mail}
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={update("email")}
        />

        <Field
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={update("password")}
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

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          I agree to the{" "}
          <span className="text-emerald-600 font-medium">Terms</span> and{" "}
          <span className="text-emerald-600 font-medium">Privacy Policy</span>
        </label>

        <PrimaryBtn onClick={() => navigate("/auth/success")}>
          Create account <ArrowRight className="w-5 h-5" />
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
