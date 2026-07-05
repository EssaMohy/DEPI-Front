import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  Check,
  Camera,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "../../context/ProfileContext";
import { profileApi, getApiErrorMessage } from "../../../lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

const MAX_AVATAR_BYTES = 10 * 1024 * 1024;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  // Shared with the Profile page: any edit made here is reflected there
  // (and everywhere else) immediately, no extra fetch required.
  const { profile, isLoading: isLoadingProfile, applyUpdate } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savedProfile, setSavedProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savedPassword, setSavedPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [avatarError, setAvatarError] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Seed the form once the shared profile (or the lightweight auth user,
  // as a fallback) is available.
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
    } else if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [profile, user]);

  const updatePassword = (key: keyof typeof passwords, value: string) => {
    setPasswords({ ...passwords, [key]: value });
    setSavedPassword(false);
    setPasswordError("");
  };

  const handleSaveProfile = async () => {
    setProfileError("");
    setSavedProfile(false);

    if (!firstName.trim() || !lastName.trim()) {
      setProfileError("First and last name are required.");
      return;
    }

    setIsSavingProfile(true);
    try {
      const updated = await profileApi.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      updateUser(updated);
      applyUpdate({ firstName: updated.firstName, lastName: updated.lastName });
      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 2500);
    } catch (err) {
      setProfileError(getApiErrorMessage(err, "Could not save your profile."));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    setPasswordError("");

    if (!passwords.current || !passwords.next || !passwords.confirm) {
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

    setIsSavingPassword(true);
    try {
      await profileApi.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPasswords({ current: "", next: "", confirm: "" });
      setSavedPassword(true);
      setTimeout(() => setSavedPassword(false), 2500);
    } catch (err) {
      setPasswordError(
        getApiErrorMessage(err, "Could not update your password."),
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleAvatarClick = () => avatarInputRef.current?.click();

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setAvatarError("");
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Image must be smaller than 10MB.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const updated = await profileApi.updateAvatar(file);
      updateUser(updated);
      applyUpdate({ avatarUrl: updated.avatar });
    } catch (err) {
      setAvatarError(getApiErrorMessage(err, "Could not upload your photo."));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const avatarSrc = profile?.avatarUrl ?? user?.avatar ?? undefined;
  const initials = `${(firstName || user?.firstName || "")[0] ?? ""}${
    (lastName || user?.lastName || "")[0] ?? ""
  }`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft />
          </button>

          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-gray-600">
              Update your photo, name, and password
            </p>
          </div>
        </div>

        {/* Avatar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-5">Profile Photo</h2>

          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarSrc} alt={profile?.userName} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl font-semibold">
                  {initials || <User size={32} />}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition disabled:opacity-60"
                aria-label="Change profile photo"
              >
                {isUploadingAvatar ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Camera size={16} />
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="text-sm text-gray-500">
              JPG or PNG, up to 10MB.
              {avatarError && (
                <p className="text-red-600 mt-1">{avatarError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Name & Username */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-5">Profile Info</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setSavedProfile(false);
                    }}
                    disabled={isLoadingProfile}
                    placeholder="First name"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Last name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setSavedProfile(false);
                    }}
                    disabled={isLoadingProfile}
                    placeholder="Last name"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  value={profile?.userName ?? user?.userName ?? ""}
                  disabled
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border bg-gray-100 text-gray-500 outline-none cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Usernames can't be changed yet.
              </p>
            </div>
          </div>

          {profileError && (
            <p className="text-red-600 text-sm mt-4">{profileError}</p>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={isSavingProfile || isLoadingProfile}
            className="mt-6 flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {isSavingProfile ? (
              <Loader2 size={18} className="animate-spin" />
            ) : savedProfile ? (
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
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-5">Change Password</h2>

          <div className="space-y-4">
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
            <p className="text-red-600 text-sm mt-4">{passwordError}</p>
          )}

          <button
            onClick={handleSavePassword}
            disabled={isSavingPassword}
            className="mt-6 flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {isSavingPassword ? (
              <Loader2 size={18} className="animate-spin" />
            ) : savedPassword ? (
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

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  placeholder: string;
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  placeholder,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {label}
      </label>

      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition"
        />

        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
