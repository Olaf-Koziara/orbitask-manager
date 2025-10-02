import { ChangePasswordData, DeleteAccountData, LoginFormData, RegisterFormData, UpdateProfileData } from '../schemas';

export type RegisterFormProps = {
    onSubmit: (data: RegisterFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
};

export type LoginFormProps = {
  onSubmit: (credentials: LoginFormData) => void;
  error: string | null;
  isLoading: boolean;
}

export type ProfileOperationsProps = {
  onUpdateProfile: (data: UpdateProfileData) => Promise<void>;
  onChangePassword: (data: ChangePasswordData) => Promise<void>;
  onDeleteAccount: (data: DeleteAccountData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
};

export type {
  ChangePasswordData,
  DeleteAccountData, LoginFormData, RegisterFormData, UpdateProfileData
};

