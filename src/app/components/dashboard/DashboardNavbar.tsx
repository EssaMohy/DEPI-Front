import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Leaf,
  Users,
  BookOpen,
  Sprout,
  Bug,
  LayoutDashboard,
  UserCircle,
  Menu,
  X,
  Settings,
  LogOut,
  User,
  CalendarDays,
} from "lucide-react";

export function DashboardNavbar() {
  const navigate = useNavigate();

  const location = useLocation();

  const [open, setOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: any) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

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

  const goTo = (path: string) => {
    navigate(path);

    setOpen(false);
  };

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
h-16
flex
items-center
justify-between
"
      >
        {/* Logo */}

        <div
          onClick={() => navigate("/dashboard")}
          className="
flex
items-center
gap-2
cursor-pointer
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
hidden
sm:block
"
          >
            Plantera
          </span>
        </div>

        {/* Desktop tabs */}

        <div
          className="
hidden
lg:flex
gap-5
"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;

            const active = location.pathname === tab.path;

            return (
              <button
                key={tab.path}
                onClick={() => goTo(tab.path)}
                className={`

flex
items-center
gap-2
px-3
py-2
rounded-lg
transition

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

        {/* Right */}

        <div
          className="
flex
items-center
gap-3
relative
"
          ref={profileRef}
        >
          {/* Profile */}

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="
text-gray-600
hover:text-emerald-600
transition
"
          >
            <UserCircle size={34} />
          </button>

          {/* Floating Menu */}

          {profileOpen && (
            <div
              className="
absolute
right-0
top-12
w-72
bg-white
rounded-2xl
shadow-xl
border
p-4
"
            >
              {/* User Info */}

              <div
                className="
flex
items-center
gap-3
pb-4
border-b
"
              >
                <div
                  className="
w-12
h-12
rounded-full
bg-emerald-100
flex
items-center
justify-center
"
                >
                  <User
                    className="
text-emerald-700
"
                  />
                </div>

                <div>
                  <h3
                    className="
font-bold
text-gray-900
"
                  >
                    Essam
                  </h3>

                  <p
                    className="
text-sm
text-gray-500
"
                  >
                    Plant Lover
                  </p>
                </div>
              </div>

              <div
                className="
mt-3
space-y-2
"
              >
                <button
                  onClick={() => navigate("/profile")}
                  className="
w-full
flex
items-center
gap-3
px-3
py-3
rounded-xl
hover:bg-gray-100
"
                >
                  <User size={18} />
                  Profile
                </button>
                <button
                  onClick={() => navigate("/care-history")}
                  className="
w-full
flex
items-center
gap-3
px-3
py-3
rounded-xl
hover:bg-gray-100
"
                >
                  <CalendarDays size={18} />
                  Care History
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="
w-full
flex
items-center
gap-3
px-3
py-3
rounded-xl
hover:bg-gray-100
"
                >
                  <Settings size={18} />
                  Settings
                </button>

                <button
                  onClick={() => {
                    // logout logic here

                    navigate("/login");
                  }}
                  className="
w-full
flex
items-center
gap-3
px-3
py-3
rounded-xl
text-red-600
hover:bg-red-50
"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}

          <button
            onClick={() => setOpen(!open)}
            className="
lg:hidden
"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile tabs */}

      {open && (
        <div
          className="
lg:hidden
border-t
bg-white
p-4
"
        >
          <div
            className="
space-y-2
"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.path}
                  onClick={() => goTo(tab.path)}
                  className="
w-full
flex
items-center
gap-3
px-4
py-3
rounded-xl
hover:bg-gray-100
"
                >
                  <Icon size={20} />

                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
