import {
  User,
  Leaf,
  Droplets,
  Sprout,
  Settings,
  LogOut,
  Edit,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();

  const user = {
    name: "Essam",

    email: "essam@example.com",

    role: "Plant Lover",

    plants: 12,

    watered: 45,

    fertilized: 18,
  };

  return (
    <div
      className="
min-h-screen
bg-gray-50
p-6
"
    >
      <div
        className="
max-w-5xl
mx-auto
space-y-6
"
      >
        {/* Profile Card */}

        <div
          className="
bg-white
rounded-3xl
shadow-sm
p-8
"
        >
          <div
            className="
flex
flex-col
md:flex-row
items-center
gap-6
"
          >
            {/* Avatar */}

            <div
              className="
w-32
h-32
rounded-full
bg-emerald-100
flex
items-center
justify-center
"
            >
              <User
                size={60}
                className="
text-emerald-700
"
              />
            </div>

            <div
              className="
flex-1
text-center
md:text-left
"
            >
              <h1
                className="
text-4xl
font-bold
text-gray-900
"
              >
                {user.name}
              </h1>

              <p
                className="
text-gray-500
mt-2
"
              >
                {user.email}
              </p>

              <span
                className="
inline-block
mt-3
bg-emerald-100
text-emerald-700
px-4
py-1
rounded-full
text-sm
font-semibold
"
              >
                {user.role}
              </span>
            </div>

            <button
              onClick={() => navigate("/profile/edit")}
              className="
flex
items-center
gap-2
bg-emerald-600
text-white
px-5
py-3
rounded-xl
hover:bg-emerald-700
transition
"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}

        <div
          className="
grid
md:grid-cols-3
gap-5
"
        >
          <StatCard icon={<Leaf />} title="My Plants" value={user.plants} />

          <StatCard
            icon={<Droplets />}
            title="Watering Done"
            value={user.watered}
          />

          <StatCard
            icon={<Sprout />}
            title="Fertilizing"
            value={user.fertilized}
          />
        </div>

        {/* Settings */}

        <div
          className="
bg-white
rounded-3xl
p-6
shadow-sm
space-y-3
"
        >
          <button
            onClick={() => navigate("/settings")}
            className="
w-full
flex
items-center
gap-3
p-4
rounded-xl
hover:bg-gray-100
transition
"
          >
            <Settings />
            Settings
          </button>

          <button
            onClick={() => navigate("/login")}
            className="
w-full
flex
items-center
gap-3
p-4
rounded-xl
text-red-600
hover:bg-red-50
transition
"
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
}: any) {
  return (
    <div
      className="
bg-white
rounded-2xl
p-5
shadow-sm
flex
items-center
gap-4
"
    >
      <div
        className="
bg-emerald-100
text-emerald-700
p-3
rounded-xl
"
      >
        {icon}
      </div>

      <div>
        <p
          className="
text-2xl
font-bold
"
        >
          {value}
        </p>

        <p
          className="
text-gray-500
text-sm
"
        >
          {title}
        </p>
      </div>
    </div>
  );
}
