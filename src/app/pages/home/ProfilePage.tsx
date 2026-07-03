import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Leaf,
  Droplets,
  Sprout,
  Settings,
  LogOut,
  Edit,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { profileApi, getApiErrorMessage, type ProfileData } from "../../../lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await profileApi.get();
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Could not load your profile."));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user
      ? `${user.firstName} ${user.lastName}`
      : "";
  const avatarSrc = profile?.avatarUrl ?? user?.avatar ?? undefined;
  const initials = `${(profile?.firstName ?? user?.firstName)?.[0] ?? ""}${
    (profile?.lastName ?? user?.lastName)?.[0] ?? ""
  }`.toUpperCase();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarSrc} alt={profile?.userName} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-3xl font-semibold">
                {initials || <User size={60} />}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900">
                {displayName}
              </h1>

              <p className="text-gray-500 mt-2">
                {profile?.email ?? user?.email}
              </p>

              <span className="inline-block mt-3 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold">
                @{profile?.userName ?? user?.userName}
              </span>
            </div>

            <button
              onClick={() => navigate("/profile/edit")}
              className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 transition"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5">
          <StatCard
            icon={<Leaf />}
            title="My Plants"
            value={profile?.plantsCount ?? 0}
          />

          <StatCard
            icon={<Droplets />}
            title="Watering Done"
            value={profile?.wateringCount ?? 0}
          />

          <StatCard
            icon={<Sprout />}
            title="Fertilizing"
            value={profile?.fertilizingCount ?? 0}
          />
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
          >
            <Settings />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 rounded-xl text-red-600 hover:bg-red-50 transition"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl">
        {icon}
      </div>

      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>
    </div>
  );
}
