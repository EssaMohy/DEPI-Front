import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  User,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useUnreadNotificationsCount } from "../../../hooks/useUnreadNotificationsCount";
import { resolveGetStartedPath } from "../../../lib/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const unreadCount = useUnreadNotificationsCount();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleGetStarted = () => {
    navigate(resolveGetStartedPath(isAuthenticated));
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate("/");
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <nav
      className="
    fixed 
    top-0 
    left-0 
    right-0 
    bg-white/80 
    backdrop-blur-md 
    z-50 
    border-b 
    border-gray-100
    "
    >
      <div
        className="
      max-w-7xl 
      mx-auto 
      px-4 
      sm:px-6 
      lg:px-8
      "
      >
        <div
          className="
        flex 
        justify-between 
        items-center 
        h-16
        "
        >
          {/* Logo */}

          <button
            onClick={() => scrollToSection("home")}
            className="
          flex 
          items-center 
          gap-2
          "
          >
            <Leaf
              className="
            w-8 
            h-8 
            text-emerald-600
            "
            />

            <span
              className="
            font-semibold 
            text-xl 
            text-gray-900
            "
            >
              Plantera
            </span>
          </button>

          {/* Links */}

          <div
            className="
          hidden 
          md:flex 
          items-center 
          gap-8
          "
          >
            <button
              onClick={() => scrollToSection("features")}
              className="
            text-gray-600 
            hover:text-emerald-600 
            transition-colors
            "
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="
            text-gray-600 
            hover:text-emerald-600 
            transition-colors
            "
            >
              How It Works
            </button>

            <button
              onClick={() => scrollToSection("join-us")}
              className="
            text-gray-600 
            hover:text-emerald-600 
            transition-colors
            "
            >
              Join Us
            </button>
          </div>

          {/* Right side: auth-aware */}

          {isAuthenticated ? (
            <div className="relative flex items-center gap-3" ref={profileRef}>
              <button
                onClick={() => navigate("/notifications")}
                className="relative text-gray-600 hover:text-emerald-600 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors"
              >
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user?.avatar ?? undefined} alt={user?.userName} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-semibold">
                    {initials || <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border p-2">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/dashboard");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 text-left"
                  >
                    <Leaf size={18} /> Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 text-left"
                  >
                    <User size={18} /> Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/settings");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 text-left"
                  >
                    <Settings size={18} /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/auth/login")}
                className="
              hidden
              sm:inline-flex
              text-gray-600
              hover:text-emerald-600
              transition-colors
              "
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="
              hidden
              sm:inline-flex
              text-gray-600
              hover:text-emerald-600
              transition-colors
              "
              >
                Register
              </button>
              <button
                onClick={handleGetStarted}
                className="
              bg-emerald-600 
              text-white 
              px-6 
              py-2 
              rounded-full 
              hover:bg-emerald-700 
              transition-colors
              "
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
