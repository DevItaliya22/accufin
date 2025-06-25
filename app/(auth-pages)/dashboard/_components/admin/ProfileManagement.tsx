import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Pencil,
  Check,
  X,
  LogOut,
  Briefcase,
  Home,
  Lock,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { s3 } from "@/lib/s3";

export default function ProfileManagement() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [editStates, setEditStates] = useState({
    contact: false,
    address: false,
    occupation: false,
  });

  const [formValues, setFormValues] = useState({
    contactNumber: "",
    address: "",
    occupation: "",
  });

  const [savingStates, setSavingStates] = useState({
    contact: false,
    address: false,
    occupation: false,
  });

  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await fetch("/api/user/info");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      setFormValues({
        contactNumber: data.contactNumber || "",
        address: data.address || "",
        occupation: data.occupation || "",
      });
    } catch (err: any) {
      setProfileError(err.message || "Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.profileImageUrl) {
      setProfileImageUrl(profile.profileImageUrl);
      setImageLoadError(false);
    } else {
      setProfileImageUrl(null);
      setImageLoadError(false);
    }
  }, [profile]);

  const handleUpdate = async (field: "contact" | "address" | "occupation") => {
    setSavingStates((prev) => ({ ...prev, [field]: true }));
    try {
      const payload = {
        ...profile,
        contactNumber: formValues.contactNumber,
        address: formValues.address,
        occupation: formValues.occupation,
      };
      const res = await fetch("/api/user/info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(`Failed to update ${field.replace("Number", "")}`);
      const data = await res.json();
      setProfile(data);
      setEditStates((prev) => ({ ...prev, [field]: false }));
      toast.success(
        `${
          field.charAt(0).toUpperCase() + field.slice(1).replace("Number", "")
        } updated`
      );
    } catch (err) {
      const error = await (err as any).json();
      toast.error(
        error.error || `Failed to update ${field.replace("Number", "")}`
      );
    } finally {
      setSavingStates((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleEditToggle = (
    field: "contact" | "address" | "occupation",
    isEditing: boolean
  ) => {
    setEditStates((prev) => ({ ...prev, [field]: isEditing }));
    if (!isEditing) {
      setFormValues({
        contactNumber: profile.contactNumber || "",
        address: profile.address || "",
        occupation: profile.occupation || "",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordValues.currentPassword,
          newPassword: passwordValues.newPassword,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to change password");
      }
      toast.success("Password changed successfully!");
      setPasswordValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPassword(false);
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImageFile) return;
    setProfileImageUploading(true);

    try {
      const filePath = s3.getUserProfilePicturePath(
        profile.id,
        profileImageFile.name
      );
      const signedUrlRes = await fetch("/api/s3/put", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath,
          contentType: profileImageFile.type,
        }),
      });

      if (!signedUrlRes.ok) throw new Error("Failed to get signed URL.");
      const { signedUrl } = await signedUrlRes.json();

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: profileImageFile,
        headers: { "Content-Type": profileImageFile.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload to S3.");

      const updateUserRes = await fetch("/api/user/info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, profileUrl: filePath }),
      });

      if (!updateUserRes.ok) throw new Error("Failed to update profile URL.");

      const updatedProfile = await updateUserRes.json();
      setProfile(updatedProfile);
      setProfileImageFile(null);
      toast.success("Profile picture updated!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setProfileImageUploading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {profileError}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8 border-b pb-8 mb-8">
        {/* Left: Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg overflow-hidden">
            {profileImageUrl && !imageLoadError ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => {
                  console.error(
                    "Failed to load profile image:",
                    profileImageUrl
                  );
                  setImageLoadError(true);
                  toast.error(
                    "Unable to load profile image. The file format may not be supported."
                  );
                }}
                onLoad={() => setImageLoadError(false)}
              />
            ) : (
              <User className="w-20 h-20 text-white" />
            )}
          </div>
        </div>

        {/* Right: Info and Actions */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            {profile?.name || "-"}
          </h1>
          <p className="text-gray-500 mb-4">Admin Profile</p>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Check if it's a supported image format
                  const supportedFormats = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp",
                    "image/gif",
                  ];
                  if (supportedFormats.includes(file.type)) {
                    setProfileImageFile(file);
                  } else {
                    toast.error(
                      "Please upload a supported image format (JPG, PNG, WebP, GIF)"
                    );
                    e.target.value = ""; // Clear the input
                  }
                } else {
                  setProfileImageFile(null);
                }
              }}
              disabled={profileImageUploading}
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            />
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={profileImageUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change Picture
            </Button>
            {profileImageFile && (
              <Button
                onClick={handleProfileImageUpload}
                disabled={profileImageUploading}
                size="sm"
              >
                {profileImageUploading ? "Uploading..." : "Upload"}
              </Button>
            )}
          </div>
          {profileImageFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {profileImageFile.name}
              <Button
                variant="link"
                className="text-red-500 hover:text-red-700 p-0 h-auto ml-2"
                onClick={() => setProfileImageFile(null)}
                disabled={profileImageUploading}
              >
                (Remove)
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Personal Information
        </h2>
        <InfoRow
          icon={Mail}
          label="Email"
          value={profile?.email}
          isEditing={false}
        />
        <InfoRow
          icon={Phone}
          label="Contact Number"
          value={formValues.contactNumber}
          isEditing={editStates.contact}
          onEditToggle={(isEditing) => handleEditToggle("contact", isEditing)}
          onSave={() => handleUpdate("contact")}
          onChange={handleInputChange}
          name="contactNumber"
          isSaving={savingStates.contact}
          placeholder="Enter contact number"
        />
        <InfoRow
          icon={Home}
          label="Address"
          value={formValues.address}
          isEditing={editStates.address}
          onEditToggle={(isEditing) => handleEditToggle("address", isEditing)}
          onSave={() => handleUpdate("address")}
          onChange={handleInputChange}
          name="address"
          isSaving={savingStates.address}
          placeholder="Enter address"
        />
        <InfoRow
          icon={Briefcase}
          label="Occupation"
          value={formValues.occupation}
          isEditing={editStates.occupation}
          onEditToggle={(isEditing) =>
            handleEditToggle("occupation", isEditing)
          }
          onSave={() => handleUpdate("occupation")}
          onChange={handleInputChange}
          name="occupation"
          isSaving={savingStates.occupation}
          placeholder="Enter occupation"
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Security
        </h2>
        {!showPassword ? (
          <div className="flex items-center">
            <Lock className="w-6 h-6 text-gray-400 mr-4" />
            <div className="flex-1">
              <div className="text-sm text-gray-500">Password</div>
              <div className="font-medium text-gray-800">**********</div>
            </div>
            <Button onClick={() => setShowPassword(true)}>
              Change Password
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <PasswordRow
              label="Current Password"
              name="currentPassword"
              value={passwordValues.currentPassword}
              onChange={handlePasswordInputChange}
              isSaving={passwordSaving}
            />
            <PasswordRow
              label="New Password"
              name="newPassword"
              value={passwordValues.newPassword}
              onChange={handlePasswordInputChange}
              isSaving={passwordSaving}
            />
            <PasswordRow
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordValues.confirmPassword}
              onChange={handlePasswordInputChange}
              isSaving={passwordSaving}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPassword(false)}
                disabled={passwordSaving}
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordSubmit} disabled={passwordSaving}>
                {passwordSaving ? "Saving..." : "Save Password"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-400 pt-4">
        Member since{" "}
        {profile?.createdAt
          ? new Date(profile.createdAt).toLocaleDateString()
          : "-"}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all text-lg shadow-md hover:shadow-lg">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will sign you out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/login");
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  isEditing: boolean;
  onEditToggle?: (isEditing: boolean) => void;
  onSave?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  isSaving?: boolean;
  placeholder?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon: Icon,
  label,
  value,
  isEditing,
  onEditToggle,
  onSave,
  onChange,
  name,
  isSaving,
  placeholder,
}) => {
  return (
    <div className="flex items-center border-b border-gray-200 pb-4">
      <Icon className="w-6 h-6 text-gray-400 mr-4" />
      <div className="flex-1">
        <div className="text-sm text-gray-500">{label}</div>
        {!isEditing ? (
          <div
            className={`font-medium text-gray-800 ${!value && "text-gray-400"}`}
          >
            {value || "Not set"}
          </div>
        ) : (
          <input
            className="border-b-2 border-cyan-400 focus:outline-none w-full py-1 text-gray-800"
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={isSaving}
            autoFocus
          />
        )}
      </div>
      {onEditToggle &&
        (!isEditing ? (
          <button
            className="ml-4 text-blue-600 hover:text-blue-800"
            onClick={() => onEditToggle(true)}
            title={value ? "Edit" : "Add"}
          >
            <Pencil className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center ml-4 space-x-2">
            <button
              className="text-green-600 hover:text-green-800"
              onClick={onSave}
              disabled={isSaving}
              title="Save"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => onEditToggle(false)}
              disabled={isSaving}
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
    </div>
  );
};

interface PasswordRowProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
}

const PasswordRow: React.FC<PasswordRowProps> = ({
  label,
  name,
  value,
  onChange,
  isSaving,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex items-center">
      <label className="w-1/3 text-sm text-gray-500">{label}</label>
      <div className="relative flex-1">
        <input
          type={isVisible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={isSaving}
          className="w-full border-b-2 border-gray-300 focus:border-cyan-400 focus:outline-none py-1 pr-10"
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
        >
          {isVisible ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
