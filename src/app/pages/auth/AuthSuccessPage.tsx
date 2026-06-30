import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AuthLayout, PrimaryBtn } from "../../components/auth/AuthUI";

export default function AuthSuccessPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">All set!</h1>
        <p className="text-gray-500 mt-2 mb-6">
          Your password has been reset. You're ready to get back to your plants.
        </p>
        <PrimaryBtn onClick={() => navigate("/auth/login")}>
          Continue to sign in
        </PrimaryBtn>
      </div>
    </AuthLayout>
  );
}
