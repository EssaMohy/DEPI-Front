import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlantProvider } from "./context/PlantContext";

import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AuthSuccessPage from "./pages/auth/AuthSuccessPage";

export default function App() {
  return (
    <PlantProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Auth */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
          <Route path="/auth/verify" element={<VerifyOtpPage />} />
          <Route path="/auth/reset" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PlantProvider>
  );
}
