import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlantProvider } from "./context/PlantContext";

import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/home/DashboardPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AuthSuccessPage from "./pages/auth/AuthSuccessPage";

import MainLayout from "./pages/home/MainLayout";

import CommunityPage from "./pages/home/CommunityPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import PlantsPage from "./pages/home/PlantsPage";
import PlantDetailsPage from "./pages/PlantDetailsPage";
import DiseasesPage from "./pages/home/DiseasesPage";
import ProfilePage from "./pages/home/ProfilePage";

import SettingsPage from "./pages/SettingsPage";
import CareHistoryPage from "./pages/CareHistoryPage";
import NotificationsPage from "./pages/NotificationsPage";

export default function App() {
  return (
    <PlantProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
          <Route path="/auth/verify" element={<VerifyOtpPage />} />
          <Route path="/auth/reset" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/*home */}
          <Route element={<MainLayout />}>
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/plants" element={<PlantsPage />} />
            <Route path="/diseases" element={<DiseasesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/plants/details" element={<PlantDetailsPage />} />
            <Route path="/articles/details" element={<ArticleDetailsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/care-history" element={<CareHistoryPage />} />
        </Routes>
      </BrowserRouter>
    </PlantProvider>
  );
}
