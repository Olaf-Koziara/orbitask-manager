import { trpc } from '@/api/trpc';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChangePasswordData, DeleteAccountData, UpdateProfileData } from '../schemas';
import { useAuthStore } from '../stores/auth.store';

export function useProfileOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser, signOut } = useAuthStore();

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: (data) => {
      setUser(data.user);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const changePasswordMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully updated.',
      });
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      toast({
        title: 'Password Change Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const deleteAccountMutation = trpc.auth.deleteAccount.useMutation({
    onSuccess: () => {
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });
      signOut();
      navigate('/login');
    },
    onError: (error) => {
      setError(error.message);
      toast({
        title: 'Account Deletion Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const updateProfile = async (data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);
    updateProfileMutation.mutate(data);
  };

  const changePassword = async (data: ChangePasswordData) => {
    setIsLoading(true);
    setError(null);
    changePasswordMutation.mutate(data);
  };

  const deleteAccount = async (data: DeleteAccountData) => {
    setIsLoading(true);
    setError(null);
    deleteAccountMutation.mutate(data);
  };

  const exportData = async () => {
    try {
      setIsLoading(true);
      
      // Create a mock data export (in a real app, this would call an API)
      const userData = useAuthStore.getState().user;
      const exportData = {
        profile: userData,
        exportDate: new Date().toISOString(),
        tasks: [], // Would be fetched from tasks API
        projects: [], // Would be fetched from projects API
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `orbitask-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Data Exported',
        description: 'Your data has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      setIsLoading(true);
      
      // Clear localStorage (except auth data)
      const keysToKeep = ['auth-storage'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear any cached data in the application
      // In a real app, you might want to clear React Query cache, etc.
      
      toast({
        title: 'Cache Cleared',
        description: 'Application cache has been cleared successfully.',
      });
    } catch (error) {
      toast({
        title: 'Clear Cache Failed',
        description: 'Failed to clear cache. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    changePassword,
    deleteAccount,
    exportData,
    clearCache,
    isLoading,
    error,
  };
}