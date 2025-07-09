"use client";
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
  Archive,
  Calendar,
  Globe,
  CreditCard,
  Building,
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
    name: false,
    sinNumber: false,
    businessNumber: false,
    dateOfBirth: false,
  });

  const [formValues, setFormValues] = useState({
    contactNumber: "",
    address: "",
    occupation: "",
    name: "",
    sinNumber: "",
    businessNumber: "",
    dateOfBirth: "",
  });

  const [savingStates, setSavingStates] = useState({
    contact: false,
    address: false,
    occupation: false,
    name: false,
    sinNumber: false,
    businessNumber: false,
    dateOfBirth: false,
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
        name: data.name || "",
        sinNumber: data.sinNumber || "",
        businessNumber: data.businessNumber || "",
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : "",
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

  const handleUpdate = async (
    field:
      | "contact"
      | "address"
      | "occupation"
      | "name"
      | "sinNumber"
      | "businessNumber"
      | "dateOfBirth"
  ) => {
    setSavingStates((prev) => ({ ...prev, [field]: true }));
    try {
      const payload = {
        ...profile,
        contactNumber: formValues.contactNumber,
        address: formValues.address,
        occupation: formValues.occupation,
        name: formValues.name,
        sinNumber: formValues.sinNumber,
        businessNumber: formValues.businessNumber,
        dateOfBirth: formValues.dateOfBirth
          ? new Date(formValues.dateOfBirth)
          : null,
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
    field:
      | "contact"
      | "address"
      | "occupation"
      | "name"
      | "sinNumber"
      | "businessNumber"
      | "dateOfBirth",
    isEditing: boolean
  ) => {
    setEditStates((prev) => ({ ...prev, [field]: isEditing }));
    if (!isEditing) {
      setFormValues({
        contactNumber: profile.contactNumber || "",
        address: profile.address || "",
        occupation: profile.occupation || "",
        name: profile.name || "",
        sinNumber: profile.sinNumber || "",
        businessNumber: profile.businessNumber || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
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

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold">Error loading profile</h3>
          <p>{profileError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-transparent p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
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
                  <span className="text-white text-2xl font-bold">
                    {getUserInitials(profile?.name || "")}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                disabled={profileImageUploading}
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
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
                      e.target.value = "";
                    }
                  } else {
                    setProfileImageFile(null);
                  }
                }}
                disabled={profileImageUploading}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {profile?.name || "Unknown User"}
              </h1>
              <p className="text-gray-600 mb-2">
                {formValues.occupation || "Admin Profile"}
              </p>
              <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Active since{" "}
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                  : "-"}
              </div>

              {profileImageFile && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Selected: {profileImageFile.name}
                  </div>
                  <div className="flex justify-center md:justify-start gap-2">
                    <Button
                      onClick={handleProfileImageUpload}
                      disabled={profileImageUploading}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {profileImageUploading ? "Uploading..." : "Upload"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProfileImageFile(null)}
                      disabled={profileImageUploading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Profile Button */}
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg"
              onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Personal Information
            </h2>
          </div>

          <div className="space-y-6">
            <ModernInfoCard
              icon={User}
              iconGradient="from-blue-500 to-blue-600"
              label="FULL NAME"
              value={formValues.name}
              isEditing={editStates.name}
              onEditToggle={(isEditing) => handleEditToggle("name", isEditing)}
              onSave={() => handleUpdate("name")}
              onChange={handleInputChange}
              name="name"
              isSaving={savingStates.name}
              placeholder="John Doe"
            />

            <ModernInfoCard
              icon={Calendar}
              iconGradient="from-indigo-500 to-indigo-600"
              label="DATE OF BIRTH"
              value={formValues.dateOfBirth}
              isEditing={editStates.dateOfBirth}
              onEditToggle={(isEditing) =>
                handleEditToggle("dateOfBirth", isEditing)
              }
              onSave={() => handleUpdate("dateOfBirth")}
              onChange={handleInputChange}
              name="dateOfBirth"
              isSaving={savingStates.dateOfBirth}
              placeholder="1990-01-01"
              inputType="date"
            />

            <ModernInfoCard
              icon={Briefcase}
              iconGradient="from-purple-500 to-purple-600"
              label="OCCUPATION"
              value={formValues.occupation}
              isEditing={editStates.occupation}
              onEditToggle={(isEditing) =>
                handleEditToggle("occupation", isEditing)
              }
              onSave={() => handleUpdate("occupation")}
              onChange={handleInputChange}
              name="occupation"
              isSaving={savingStates.occupation}
              placeholder="Product Designer"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Contact Information
            </h2>
          </div>

          <div className="space-y-6">
            <ModernInfoCard
              icon={Mail}
              iconGradient="from-blue-500 to-blue-600"
              label="EMAIL ADDRESS"
              value={profile?.email || ""}
              isEditing={false}
            />

            <ModernInfoCard
              icon={Phone}
              iconGradient="from-green-500 to-green-600"
              label="PHONE NUMBER"
              value={formValues.contactNumber}
              isEditing={editStates.contact}
              onEditToggle={(isEditing) =>
                handleEditToggle("contact", isEditing)
              }
              onSave={() => handleUpdate("contact")}
              onChange={handleInputChange}
              name="contactNumber"
              isSaving={savingStates.contact}
              placeholder="+1 (555) 123-4567"
            />

            <ModernInfoCard
              icon={Home}
              iconGradient="from-red-500 to-pink-600"
              label="ADDRESS"
              value={formValues.address}
              isEditing={editStates.address}
              onEditToggle={(isEditing) =>
                handleEditToggle("address", isEditing)
              }
              onSave={() => handleUpdate("address")}
              onChange={handleInputChange}
              name="address"
              isSaving={savingStates.address}
              placeholder="123 Main Street, San Francisco, CA 94105"
            />
          </div>
        </div>

        {/* Business Information Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <Building className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Business Information
            </h2>
          </div>

          <div className="space-y-6">
            <ModernInfoCard
              icon={CreditCard}
              iconGradient="from-purple-500 to-purple-600"
              label="SIN NUMBER"
              value={formValues.sinNumber}
              isEditing={editStates.sinNumber}
              onEditToggle={(isEditing) =>
                handleEditToggle("sinNumber", isEditing)
              }
              onSave={() => handleUpdate("sinNumber")}
              onChange={handleInputChange}
              name="sinNumber"
              isSaving={savingStates.sinNumber}
              placeholder="123-456-789"
            />

            <ModernInfoCard
              icon={Building}
              iconGradient="from-indigo-500 to-indigo-600"
              label="BUSINESS NUMBER"
              value={formValues.businessNumber}
              isEditing={editStates.businessNumber}
              onEditToggle={(isEditing) =>
                handleEditToggle("businessNumber", isEditing)
              }
              onSave={() => handleUpdate("businessNumber")}
              onChange={handleInputChange}
              name="businessNumber"
              isSaving={savingStates.businessNumber}
              placeholder="123456789RT0001"
            />
          </div>
        </div>

        {/* Archive Section */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                <Archive className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Document Archive
              </h2>
            </div>
            <Button
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-2 rounded-xl shadow-lg"
              onClick={() => {
                // TODO: Navigate to archive section
                toast("Archive feature will be implemented soon!");
              }}
            >
              <Archive className="w-4 h-4 mr-2" />
              View Archive
            </Button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="text-center text-gray-600">
              <Archive className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                Access Historical Documents
              </h3>
              <p className="text-sm">
                View and manage your archived documents and transaction history.
              </p>
            </div>
          </div>
        </div> */}

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center mr-3">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Security</h2>
          </div>

          {!showPassword ? (
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mr-4">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">
                    PASSWORD
                  </div>
                  <div className="font-medium text-gray-800">••••••••••</div>
                </div>
              </div>
              <Button
                onClick={() => setShowPassword(true)}
                className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white"
              >
                Change Password
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
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
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPassword(false)}
                  disabled={passwordSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordSubmit}
                  disabled={passwordSaving}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  {passwordSaving ? "Saving..." : "Save Password"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <div className="text-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl shadow-lg text-lg">
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
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
      </div>
    </div>
  );
}

interface ModernInfoCardProps {
  icon: React.ElementType;
  iconGradient: string;
  label: string;
  value: string;
  isEditing: boolean;
  onEditToggle?: (isEditing: boolean) => void;
  onSave?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  isSaving?: boolean;
  placeholder?: string;
  inputType?: string;
}

const ModernInfoCard: React.FC<ModernInfoCardProps> = ({
  icon: Icon,
  iconGradient,
  label,
  value,
  isEditing,
  onEditToggle,
  onSave,
  onChange,
  name,
  isSaving,
  placeholder,
  inputType = "text",
}) => {
  return (
    <div className="flex items-center p-6 bg-gray-50 rounded-xl border-l-4 border-blue-500">
      <div
        className={`w-12 h-12 bg-gradient-to-r ${iconGradient} rounded-lg flex items-center justify-center mr-4 shadow-lg`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1">
        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
          {label}
        </div>
        {!isEditing ? (
          <div
            className={`text-lg font-medium ${
              !value ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {value || "Not provided"}
          </div>
        ) : (
          <input
            className="text-lg font-medium bg-white border-2 border-blue-300 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 w-full"
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={isSaving}
            autoFocus
          />
        )}
      </div>

      {onEditToggle && (
        <div className="ml-4">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditToggle(true)}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditToggle(false)}
                disabled={isSaving}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
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
    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
      <label className="w-1/3 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative flex-1">
        <input
          type={isVisible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={isSaving}
          className="w-full bg-white border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-2 pr-12"
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
