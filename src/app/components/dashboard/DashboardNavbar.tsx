import { useState } from "react";
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
} from "lucide-react";

export function DashboardNavbar() {
  const navigate = useNavigate();

  const location = useLocation();

  const [open, setOpen] = useState(false);

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
text-gray-900
hidden
sm:block
"
          >
            Plantera
          </span>
        </div>

        {/* Desktop Tabs */}

        <div
          className="
hidden
lg:flex
gap-4
xl:gap-6
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

                <span>{tab.name}</span>
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
"
        >
          <button
            onClick={() => navigate("/profile")}
            className="
text-gray-600
hover:text-emerald-600
"
          >
            <UserCircle size={34} />
          </button>

          {/* Mobile Button */}

          <button
            onClick={() => setOpen(!open)}
            className="
lg:hidden
text-gray-700
"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      {open && (
        <div
          className="
lg:hidden
px-4
pb-5
bg-white
border-t
"
        >
          <div
            className="
flex
flex-col
gap-2
mt-4
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
gap-3
px-4
py-3
rounded-xl
transition

${
  active ? "bg-emerald-100 text-emerald-700" : "text-gray-600 hover:bg-gray-100"
}

`}
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
