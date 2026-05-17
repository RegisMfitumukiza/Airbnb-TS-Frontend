import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


import {
    deletMyAvatar,
    updateMyAccount,
    uploadMyAvatar,
    changePassword,
    forgotPassword,
    resetPassword,
    type UpdateAccountPayload,
    type ChangePasswordPayload,
    type ForgotPasswordPayload,
    type ResetPasswordPayload
} from "../api/accountApi";


export function useUpdateAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateAccountPayload) => updateMyAccount(payload),
        onSuccess: (user) => {
            toast.success("Profile updated");
            queryClient.setQueryData(["me"], user);
            queryClient.invalidateQueries({ queryKey: ["me"]})
        },
        
        onError: () => {
            toast.error("Failed to update profile")
        },
    });
}


export function useUploadAvatar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => uploadMyAvatar(file),
        onSuccess: (user) => {
            toast.success("Avatar Uploaded");
            queryClient.setQueryData(["me"], user);
            queryClient.invalidateQueries({ queryKey: ["me"]})
        },
        onError: () => {
            toast.error("Failed to upload avatar")
        },
    });
}


export function useDeleteAvatar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletMyAvatar,
        onSuccess: (user) => {
            toast.success("Avatar deleted");
            queryClient.setQueryData(["me"], user);
            queryClient.invalidateQueries({ queryKey: ["me"]})
        },
        onError: () => {
            toast.error("Failed to delete avatar ")
        }
    });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
    onSuccess: () => {
      toast.success("Password reset instructions sent");
    },
    onError: () => {
      toast.error("Failed to send reset instructions");
    },
  });
}

export function useResetPassword(token: string) {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      resetPassword(token, payload),
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: () => {
      toast.error("Failed to reset password");
    },
  });
}