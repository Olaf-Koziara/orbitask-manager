import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Separator } from "@/features/shared/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Loader2, Lock, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordData,
  type UpdateProfileData,
} from "../schemas";

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onUpdateProfile: (data: UpdateProfileData) => Promise<void>;
  onChangePassword: (data: ChangePasswordData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function ProfileForm({
  user,
  onUpdateProfile,
  onChangePassword,
  isLoading = false,
  error,
}: ProfileFormProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const profileForm = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const passwordForm = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleProfileSubmit = async (data: UpdateProfileData) => {
    try {
      await onUpdateProfile(data);
      setIsEditingProfile(false);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handlePasswordSubmit = async (data: ChangePasswordData) => {
    try {
      await onChangePassword(data);
      setIsChangingPassword(false);
      passwordForm.reset();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const cancelProfileEdit = () => {
    profileForm.reset({
      name: user.name,
      email: user.email,
    });
    setIsEditingProfile(false);
  };

  const cancelPasswordChange = () => {
    passwordForm.reset();
    setIsChangingPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            Profile Information
          </CardTitle>
          {!isEditingProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...profileForm.register("name")}
                disabled={!isEditingProfile || isLoading}
                placeholder="Enter your full name"
              />
              {profileForm.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...profileForm.register("email")}
                disabled={!isEditingProfile || isLoading}
                placeholder="Enter your email address"
              />
              {profileForm.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {profileForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {isEditingProfile && (
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Changes</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelProfileEdit}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Security</CardTitle>
          {!isChangingPassword && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <div className="text-sm text-gray-600">
              <p>Keep your account secure by using a strong password.</p>
              <p className="mt-1">Last updated: Never</p>
            </div>
          ) : (
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  disabled={isLoading}
                  placeholder="Enter your current password"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                  disabled={isLoading}
                  placeholder="Enter your new password"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  disabled={isLoading}
                  placeholder="Confirm your new password"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  <span>Update Password</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelPasswordChange}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
