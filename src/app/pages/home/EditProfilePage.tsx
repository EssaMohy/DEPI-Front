import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  Check,
} from "lucide-react";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Essam",

    username: "essam_plants",
  });

  const [passwords, setPasswords] = useState({
    current: "",

    next: "",

    confirm: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNext, setShowNext] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [savedProfile, setSavedProfile] = useState(false);

  const [savedPassword, setSavedPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const updateProfile = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });

    setSavedProfile(false);
  };

  const updatePassword = (key: string, value: string) => {
    setPasswords({ ...passwords, [key]: value });

    setSavedPassword(false);

    setPasswordError("");
  };

  const handleSaveProfile = () => {
    setSavedProfile(true);

    setTimeout(() => setSavedProfile(false), 2500);
  };

  const handleSavePassword = () => {
    if (
      !passwords.current ||
      !passwords.next ||
      !passwords.confirm
    ) {
      setPasswordError("Please fill in all password fields");

      return;
    }

    if (passwords.next.length < 8) {
      setPasswordError("New password must be at least 8 characters");

      return;
    }

    if (passwords.next !== passwords.confirm) {
      setPasswordError("New passwords do not match");

      return;
    }

    setPasswordError("");

    setSavedPassword(true);

    setPasswords({ current: "", next: "", confirm: "" });

    setTimeout(() => setSavedPassword(false), 2500);
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
              Edit Profile
            </h1>

            <p
              className="
text-gray-600
"
            >
              Update your name, username, and password
            </p>
          </div>
        </div>

        {/* Name & Username */}

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
            Profile Info
          </h2>

          <div
            className="
space-y-4
"
          >
            <div>
              <label
                className="
block
text-sm
font-medium
text-gray-600
mb-2
"
              >
                Name
              </label>

              <div
                className="
relative
"
              >
                <User
                  className="
absolute
left-4
top-1/2
-translate-y-1/2
text-gray-400
w-5
h-5
"
                />

                <input
                  value={profile.name}
                  onChange={(e) => updateProfile("name", e.target.value)}
                  placeholder="Your name"
                  className="
w-full
pl-12
pr-4
py-3.5
rounded-xl
border
bg-gray-50
focus:ring-2
focus:ring-emerald-500
focus:bg-white
outline-none
transition
"
                />
              </div>
            </div>

            <div>
              <label
                className="
block
text-sm
font-medium
text-gray-600
mb-2
"
              >
                Username
              </label>

              <div
                className="
relative
"
              >
                <AtSign
                  className="
absolute
left-4
top-1/2
-translate-y-1/2
text-gray-400
w-5
h-5
"
                />

                <input
                  value={profile.username}
                  onChange={(e) =>
                    updateProfile("username", e.target.value)
                  }
                  placeholder="Username"
                  className="
w-full
pl-12
pr-4
py-3.5
rounded-xl
border
bg-gray-50
focus:ring-2
focus:ring-emerald-500
focus:bg-white
outline-none
transition
"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="
mt-6
flex
items-center
gap-2
bg-emerald-600
text-white
px-6
py-3
rounded-xl
font-semibold
hover:bg-emerald-700
transition
"
          >
            {savedProfile ? (
              <>
                <Check size={18} />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {/* Change Password */}

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
            Change Password
          </h2>

          <div
            className="
space-y-4
"
          >
            <PasswordField
              label="Current Password"
              value={passwords.current}
              onChange={(v: string) => updatePassword("current", v)}
              show={showCurrent}
              onToggleShow={() => setShowCurrent(!showCurrent)}
              placeholder="Enter current password"
            />

            <PasswordField
              label="New Password"
              value={passwords.next}
              onChange={(v: string) => updatePassword("next", v)}
              show={showNext}
              onToggleShow={() => setShowNext(!showNext)}
              placeholder="Enter new password"
            />

            <PasswordField
              label="Confirm New Password"
              value={passwords.confirm}
              onChange={(v: string) => updatePassword("confirm", v)}
              show={showConfirm}
              onToggleShow={() => setShowConfirm(!showConfirm)}
              placeholder="Re-enter new password"
            />
          </div>

          {passwordError && (
            <p
              className="
text-red-600
text-sm
mt-4
"
            >
              {passwordError}
            </p>
          )}

          <button
            onClick={handleSavePassword}
            className="
mt-6
flex
items-center
gap-2
bg-emerald-600
text-white
px-6
py-3
rounded-xl
font-semibold
hover:bg-emerald-700
transition
"
          >
            {savedPassword ? (
              <>
                <Check size={18} />
                Password Updated
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,

  value,

  onChange,

  show,

  onToggleShow,

  placeholder,
}: any) {
  return (
    <div>
      <label
        className="
block
text-sm
font-medium
text-gray-600
mb-2
"
      >
        {label}
      </label>

      <div
        className="
relative
"
      >
        <Lock
          className="
absolute
left-4
top-1/2
-translate-y-1/2
text-gray-400
w-5
h-5
"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
w-full
pl-12
pr-12
py-3.5
rounded-xl
border
bg-gray-50
focus:ring-2
focus:ring-emerald-500
focus:bg-white
outline-none
transition
"
        />

        <button
          type="button"
          onClick={onToggleShow}
          className="
absolute
right-4
top-1/2
-translate-y-1/2
text-gray-400
hover:text-gray-600
"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
