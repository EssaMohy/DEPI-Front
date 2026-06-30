import { useNavigate, useLocation } from "react-router-dom";
import {
  Leaf,
  Users,
  BookOpen,
  Sprout,
  Bug,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";

export function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      name: "Community",
      path: "/community",
      icon: Users,
    },
    {
      name: "Articles",
      path: "/articles",
      icon: BookOpen,
    },
    {
      name: "Plants",
      path: "/plants",
      icon: Sprout,
    },
    {
      name: "Diseases",
      path: "/diseases",
      icon: Bug,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-emerald-600" />
          <span className="font-semibold text-xl text-gray-900">Plantera</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            const active = location.pathname === tab.path;

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  ${
                    active
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:text-emerald-600"
                  }
                `}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className="text-gray-600 hover:text-emerald-600"
        >
          <UserCircle size={34} />
        </button>
      </div>
    </nav>
  );
}
