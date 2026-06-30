import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthLayout, Field, PrimaryBtn } from "../../components/auth/AuthUI";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <AuthLayout>
      <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-emerald-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
      <p className="text-gray-500 mt-1 mb-6">
        Your new password must be different from previous ones.
      </p>

      <div className="space-y-4">
        <Field
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="New password"
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
        <Field
          icon={Lock}
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm new password"
          trailing={
            <button
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
        <PrimaryBtn onClick={() => navigate("/auth/success")}>
          Reset password <ArrowRight className="w-5 h-5" />
        </PrimaryBtn>
      </div>
    </AuthLayout>
  );
}
