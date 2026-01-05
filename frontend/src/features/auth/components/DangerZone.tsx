import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/features/shared/components/ui/alert-dialog";
import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Lock, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { deleteAccountSchema, type DeleteAccountData } from "@/features/auth/schemas";

interface DangerZoneProps {
  onDeleteAccount: (data: DeleteAccountData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function DangerZone({
  onDeleteAccount,
  isLoading = false,
  error,
}: DangerZoneProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const deleteForm = useForm<DeleteAccountData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmation: "",
    },
  });

  const handleDeleteAccount = async (data: DeleteAccountData) => {
    try {
      await onDeleteAccount(data);
      setIsDeleteDialogOpen(false);
      setShowPasswordForm(false);
      deleteForm.reset();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
    setShowPasswordForm(false);
    deleteForm.reset();
  };

  const proceedToPasswordForm = () => {
    const confirmation = deleteForm.getValues("confirmation");
    if (confirmation === "DELETE") {
      setShowPasswordForm(true);
    }
  };

  const goBackToConfirmation = () => {
    setShowPasswordForm(false);
    deleteForm.setValue("password", "");
  };

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <span>Danger Zone</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            These actions are irreversible. Please proceed with caution.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="p-4 border border-red-200 rounded-lg bg-white">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-red-700">Delete Account</h3>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                  <li>All your tasks and projects will be deleted</li>
                  <li>Your profile and settings will be removed</li>
                  <li>You will be immediately logged out</li>
                  <li>This action is permanent and irreversible</li>
                </ul>
              </div>
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={openDeleteDialog}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Delete Account</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-3">
                        <p>
                          This will permanently delete your account and all
                          data.
                        </p>

                        {!showPasswordForm ? (
                          <div className="space-y-3">
                            <p className="text-sm font-medium">
                              To confirm, type{" "}
                              <span className="bg-gray-100 px-1 rounded font-mono">
                                DELETE
                              </span>{" "}
                              below:
                            </p>
                            <Input
                              {...deleteForm.register("confirmation")}
                              placeholder="Type DELETE to confirm"
                              className="font-mono"
                            />
                            {deleteForm.formState.errors.confirmation && (
                              <p className="text-sm text-red-600">
                                {
                                  deleteForm.formState.errors.confirmation
                                    .message
                                }
                              </p>
                            )}
                          </div>
                        ) : (
                          <form
                            onSubmit={deleteForm.handleSubmit(
                              handleDeleteAccount
                            )}
                            className="space-y-3"
                          >
                            {error && (
                              <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                              </Alert>
                            )}

                            <div className="space-y-2">
                              <Label
                                htmlFor="deletePassword"
                                className="flex items-center space-x-2"
                              >
                                <Lock className="h-4 w-4" />
                                <span>Enter your password to confirm:</span>
                              </Label>
                              <Input
                                id="deletePassword"
                                type="password"
                                {...deleteForm.register("password")}
                                placeholder="Enter your password"
                                disabled={isLoading}
                              />
                              {deleteForm.formState.errors.password && (
                                <p className="text-sm text-red-600">
                                  {deleteForm.formState.errors.password.message}
                                </p>
                              )}
                            </div>
                          </form>
                        )}
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    {!showPasswordForm ? (
                      <>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          onClick={proceedToPasswordForm}
                          disabled={
                            deleteForm.watch("confirmation") !== "DELETE"
                          }
                          variant="destructive"
                        >
                          Continue
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={goBackToConfirmation}
                          disabled={isLoading}
                        >
                          Back
                        </Button>
                        <AlertDialogCancel disabled={isLoading}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          onClick={deleteForm.handleSubmit(handleDeleteAccount)}
                          disabled={isLoading || !deleteForm.watch("password")}
                          variant="destructive"
                          className="flex items-center space-x-2"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span>Delete Account</span>
                        </Button>
                      </>
                    )}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
