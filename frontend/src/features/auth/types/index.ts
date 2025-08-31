import { LoginFormData } from '../schemas';
import { RegisterFormData } from '../schemas';

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
export type { RegisterFormData, LoginFormData };
