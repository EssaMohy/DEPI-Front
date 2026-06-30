import { useState } from "react";
import {
  Bell,
  Droplets,
  Sprout,
  Bug,
  Moon,
  Globe,
  Shield,
  LogOut,
  ChevronLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    water: true,

    fertilize: true,

    disease: true,

    dark: false,
  });

  const toggle = (key: string) => {
    setSettings({
      ...settings,

      [key]: !settings[key as keyof typeof settings],
    });
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
max-w-3xl
mx-auto
space-y-6
"
      >
        {/* Header */}

        <div
          className="
flex
items-center
gap-3
"
        >
          <button
            onClick={() => navigate(-1)}
            className="
p-2
rounded-full
hover:bg-gray-200
"
          >
            <ChevronLeft />
          </button>

          <div>
            <h1
              className="
text-3xl
font-bold
"
            >
              Settings
            </h1>

            <p
              className="
text-gray-600
"
            >
              Manage your Plantera experience
            </p>
          </div>
        </div>

        {/* Notifications */}

        <div
          className="
bg-white
rounded-3xl
p-6
shadow-sm
"
        >
          <h2
            className="
text-xl
font-bold
mb-5
"
          >
            Notifications
          </h2>

          <SettingItem
            icon={<Droplets />}
            title="Water Reminders"
            description="Get notified when plants need watering"
            enabled={settings.water}
            onClick={() => toggle("water")}
          />

          <SettingItem
            icon={<Sprout />}
            title="Fertilizing Reminders"
            description="Receive fertilizer schedules"
            enabled={settings.fertilize}
            onClick={() => toggle("fertilize")}
          />

          <SettingItem
            icon={<Bug />}
            title="Disease Alerts"
            description="Get alerts after AI diagnosis"
            enabled={settings.disease}
            onClick={() => toggle("disease")}
          />
        </div>

        {/* Appearance */}

        <div
          className="
bg-white
rounded-3xl
p-6
shadow-sm
"
        >
          <h2
            className="
text-xl
font-bold
mb-5
"
          >
            Appearance
          </h2>

          <SettingItem
            icon={<Moon />}
            title="Dark Mode"
            description="Change application theme"
            enabled={settings.dark}
            onClick={() => toggle("dark")}
          />
        </div>

        {/* Other */}

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
            className="
w-full
flex
items-center
gap-3
p-4
rounded-xl
hover:bg-gray-100
"
          >
            <Globe />
            Language
          </button>

          <button
            className="
w-full
flex
items-center
gap-3
p-4
rounded-xl
hover:bg-gray-100
"
          >
            <Shield />
            Privacy
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

function SettingItem({
  icon,

  title,

  description,

  enabled,

  onClick,
}: any) {
  return (
    <div
      className="
flex
items-center
justify-between
py-4
border-b
last:border-none
"
    >
      <div
        className="
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
          <h3
            className="
font-semibold
"
          >
            {title}
          </h3>

          <p
            className="
text-sm
text-gray-500
"
          >
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onClick}
        className={`

w-12
h-6
rounded-full
transition
relative

${enabled ? "bg-emerald-600" : "bg-gray-300"}

`}
      >
        <span
          className={`

absolute
top-1
w-4
h-4
bg-white
rounded-full
transition

${enabled ? "right-1" : "left-1"}

`}
        />
      </button>
    </div>
  );
}
