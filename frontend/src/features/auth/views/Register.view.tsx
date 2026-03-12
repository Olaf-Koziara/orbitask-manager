import { Link } from "react-router-dom";
import { RegisterForm } from "@/features/auth/components/Register.form";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageTransition } from "@/features/shared/components/PageTransition";

export const RegisterView = () => {
  const { register, isLoading, error } = useAuth();

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Background blobs for depth */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/30 rounded-full blur-[100px] opacity-50" />

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 text-center">
             <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl shadow-glow flex items-center justify-center mb-6">
                <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <RegisterForm onSubmit={register} error={error} isLoading={isLoading} />
        </div>
      </div>
    </PageTransition>
  );
};
